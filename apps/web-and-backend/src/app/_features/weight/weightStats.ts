import {
  MIN_DATA_POINTS,
  WeightFeedback,
  analyzeWeightTrend,
} from "@/application-layer/use-cases/day/GetWeightFeedbackForLastNDaysUsecase/GetWeightFeedbackForLastNDaysUsecase";

export function getWeightFeedback(weights: number[]): string {
  if (weights.length < MIN_DATA_POINTS) {
    return "No hay suficientes datos todavía";
  }
  return buildMessage(analyzeWeightTrend(weights));
}

function buildMessage(feedback: WeightFeedback): string {
  switch (feedback) {
    case "stable":
      return "Tu peso se mantiene estable";
    case "decreasing":
      return "Estás bajando de peso a un ritmo saludable";
    case "DECREASING":
      return "Estás bajando peso demasiado rápido";
    case "increasing":
      return "Estás subiendo de peso a un ritmo saludable";
    case "INCREASING":
      return "Estás subiendo peso demasiado rápido";
  }
}
