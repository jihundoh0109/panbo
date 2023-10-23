import { useRouter } from "next/navigation";
import { ZodSchema, z } from "zod";
import { useSignUpContext } from "@/context/AuthProvider";
import { verificationCodeSchema } from "@/lib/validations";
import AuthForm from "@/components/Auth/AuthForm";
import AuthPrompt from "@/components/Auth/AuthPrompt";

export default function StepThree() {
  const { signUp, meadowInfo, setActive } = useSignUpContext();

  const router = useRouter();

  async function handleSubmit(values: z.infer<ZodSchema<any>>) {
    const result = await signUp!.attemptEmailAddressVerification({
      code: values.verificationCode,
    });
    await setActive!({ session: result.createdSessionId });
    router.push(`/${meadowInfo!.id}`);
  }

  return (
    <>
      <AuthForm
        title="Verify email"
        schema={verificationCodeSchema}
        defaultValues={{
          verificationCode: "",
        }}
        inputs={[
          {
            name: "verificationCode",
            label: "Verification Code",
            type: "text",
          },
        ]}
        handleInputs={handleSubmit}
      />
      <AuthPrompt promptTo="Resend code" authData={signUp} />
    </>
  );
}
