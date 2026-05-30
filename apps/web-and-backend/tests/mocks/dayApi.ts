import { vi } from "vitest";

import {
  AppGetAssembledDayById,
  AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays,
  AppGetMultipleAssembledDaysByIds,
} from "../../src/interface-adapters/app/use-cases/day";
import { TEST_USER_ID } from "./nextjs";

export function mockDayApiFetch() {
  vi.spyOn(global, "fetch").mockImplementation((input) => {
    const url = typeof input === "string" ? input : input.toString();

    if (url.includes("/api/day/assembled?")) {
      const idsParam =
        new URL(url, "http://localhost").searchParams.get("ids") ?? "";

      const dayIds = idsParam ? idsParam.split(",") : [];

      return AppGetMultipleAssembledDaysByIds.execute({
        dayIds,
        userId: TEST_USER_ID,
      }).then((data) => {
        return new Response(JSON.stringify({ status: "success", data }), {
          headers: { "Content-Type": "application/json" },
        });
      });
    }

    if (url.includes("/api/day/assembled/")) {
      const dayId = url.split("/api/day/assembled/")[1].split("?")[0];

      return AppGetAssembledDayById.execute({
        dayId,
        userId: TEST_USER_ID,
      }).then((data) => {
        return new Response(JSON.stringify({ status: "success", data }), {
          headers: { "Content-Type": "application/json" },
        });
      });
    }

    if (url.includes("/api/day/last/")) {
      const numberOfDays = parseInt(
        url.split("/api/day/last/")[1].split("?")[0],
        10,
      );

      return AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays.execute(
        {
          numberOfDays,
          userId: TEST_USER_ID,
        },
      ).then((data) => {
        return new Response(JSON.stringify({ status: "success", data }), {
          headers: { "Content-Type": "application/json" },
        });
      });
    }

    return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
  });
}
