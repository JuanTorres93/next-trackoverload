import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { ExerciseFinderResult } from "@/domain/services/ExerciseFinder.port";
import { AppFindExerciseByFuzzyNameUsecase } from "@/interface-adapters/app/use-cases/exercise/FindExerciseByFuzzyName/findExerciseByFuzzyName";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
): Promise<NextResponse<JSENDResponse<ExerciseFinderResult[]>>> {
  try {
    const { name } = await params;
    const term = decodeURIComponent(name || "").trim();
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);

    if (!term) {
      return NextResponse.json(
        { status: "fail", data: { message: "Missing exercise name" } },
        { status: 400 },
      );
    }

    const foundExercises: ExerciseFinderResult[] =
      await AppFindExerciseByFuzzyNameUsecase.execute({
        name: term,
        page,
      });

    return NextResponse.json(
      { status: "success", data: foundExercises },
      { status: 200 },
    );
  } catch (error) {
    console.log(
      "app/api/exercise/fuzzy/[name]/GET: Error fetching exercises:",
      error,
    );

    return NextResponse.json(
      { status: "fail", data: { message: "Failed to fetch exercises" } },
      { status: 500 },
    );
  }
}
