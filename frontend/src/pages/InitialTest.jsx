"use client"

import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import Button from "../components/Button"
import { Card } from "../../components/ui"

function InitialTest() {
  const navigate = useNavigate()
  const { fetchProfile } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)

  const questions = [
    {
      id: "anxiety_level",
      question: "¿Cómo calificarías tu nivel de ansiedad en general?",
      type: "scale",
      scale: { min: 1, max: 10, labels: ["Muy bajo", "Muy alto"] },
    },
    {
      id: "depression_level",
      question: "¿Cómo calificarías tu estado de ánimo en las últimas semanas?",
      type: "scale",
      scale: { min: 1, max: 10, labels: ["Muy deprimido", "Muy animado"] },
    },
    {
      id: "stress_level",
      question: "¿Qué tan estresado te has sentido últimamente?",
      type: "scale",
      scale: { min: 1, max: 10, labels: ["Nada estresado", "Extremadamente estresado"] },
    },
    {
      id: "main_concerns",
      question: "¿Cuáles son tus principales preocupaciones o motivos para buscar terapia?",
      type: "textarea",
    },
    {
      id: "previous_therapy",
      question: "¿Has tenido experiencia previa con terapia psicológica?",
      type: "boolean",
    },
  ]

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitTest()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitTest = async () => {
    setLoading(true)
    try {
      await api.patch("/auth/patient/profile/", {
        ...answers,
        initial_test_completed: true,
      })
      await fetchProfile()
      navigate("/")
    } catch (error) {
      console.error("Error submitting test:", error)
    } finally {
      setLoading(false)
    }
  }

  const currentQ = questions[currentQuestion]
  const currentAnswer = answers[currentQ.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Evaluación Inicial</h1>
          <p className="text-gray-600">
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentQ.question}</h2>

            {currentQ.type === "scale" && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{currentQ.scale.labels[0]}</span>
                  <span>{currentQ.scale.labels[1]}</span>
                </div>
                <div className="flex justify-between">
                  {Array.from({ length: currentQ.scale.max }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleAnswer(num)}
                      className={`w-10 h-10 rounded-full border-2 font-medium transition-colors ${
                        currentAnswer === num
                          ? "bg-primary-600 border-primary-600 text-white"
                          : "border-gray-300 hover:border-primary-400"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentQ.type === "textarea" && (
              <textarea
                value={currentAnswer || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Escribe tu respuesta aquí..."
              />
            )}

            {currentQ.type === "boolean" && (
              <div className="space-y-2">
                <button
                  onClick={() => handleAnswer(true)}
                  className={`w-full p-3 text-left border rounded-lg transition-colors ${
                    currentAnswer === true
                      ? "bg-primary-50 border-primary-500 text-primary-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Sí, he tenido terapia anteriormente
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className={`w-full p-3 text-left border rounded-lg transition-colors ${
                    currentAnswer === false
                      ? "bg-primary-50 border-primary-500 text-primary-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  No, esta sería mi primera experiencia
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
              Anterior
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={currentAnswer === undefined || currentAnswer === ""}
              loading={loading && currentQuestion === questions.length - 1}
            >
              {currentQuestion === questions.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default InitialTest
