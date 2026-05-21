import { NextResponse, NextRequest } from "next/server";
import { userCookedRecipeSchema} from "@/lib/validations/user-choices"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    const userCookedRecipeSchemaValidation = userCookedRecipeSchema.safeParse(body)

    if(!userCookedRecipeSchemaValidation.success) {
        return NextResponse.json({
            message: "we couldn't process your request",
            status: 400
        })
    }
    return NextResponse.json({
      message: "we receive your request",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong, internal system error",
      status: 500,
    });
  }
}
