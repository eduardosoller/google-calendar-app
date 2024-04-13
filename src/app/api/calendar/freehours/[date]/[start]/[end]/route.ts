import { NextResponse } from "next/server";
import { useCases } from "@/server/use-cases";
export const fetchCache = 'force-no-store';
export async function GET(
  request: Request,
  context: { params: { date: string; start: string; end: string } }
) {
  try {
    const freehours = await useCases.freeHours(context.params);
    return NextResponse.json(freehours);
  } catch (error: any) {
    throw new Error(error.message)
  }
}
