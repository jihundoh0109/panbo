"use client";

import { useRouter } from "next/navigation";
import { ZodSchema, z } from "zod";
import { logInSchema } from "@/lib/validations";
import { useSignInContext } from "@/context/AuthProvider";
import Prompt from "@/components/Auth/Prompt";
import Form from "@/components/common/Form/Form";
import FormTitle from "@/components/common/Form/FormTitle";
import Loading from "@/components/common/Loading";

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignInContext();

  const router = useRouter();

  async function handleSubmit(values: z.infer<ZodSchema<any>>) {
    const result = await signIn!.create({
      identifier: values.email,
      password: values.password,
    });
    await setActive!({ session: result.createdSessionId });
    router.push("/");
  }

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center w-[350px]">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      <div className="w-full">
        <FormTitle title="Sign in" />
        <Form
          schema={logInSchema}
          defaultValues={{
            email: "",
            password: "",
          }}
          inputs={[
            {
              name: "email",
              label: "Email address",
              type: "text",
              placeholder: "Email address",
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Password",
            },
          ]}
          handleSubmit={handleSubmit}
          additionalPrompt={<Prompt promptTo="Forgot password" />}
          formStyles="space-y-2 mb-2"
        />
        <Prompt promptTo="Sign up" />
      </div>
    </div>
  );
}
