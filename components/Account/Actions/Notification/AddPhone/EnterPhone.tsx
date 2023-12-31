import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { useAddPhone } from "@/context/AddPhoneProvider";
import { phoneSchema } from "@/lib/validations";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Form from "@/components/common/Form/Form";

export default function StepOne() {
  const { user } = useUser();
  
  const { setStep } = useAddPhone();

  async function sendTextVerification(values: z.infer<typeof phoneSchema>) {
    // delete any previous numbers (user can only have one number at a time)
    const phoneListFromDb = user!.phoneNumbers;
    if (phoneListFromDb.length > 0) {
      await Promise.all(
        phoneListFromDb.map(async (phoneInDb) => {
          phoneInDb.verification.status !== "verified" &&
            (await phoneInDb.destroy());
        })
      );
    }

    await user!.reload();

    const addedPhone = await user!.createPhoneNumber({
      phoneNumber: values.phone,
    });
    await addedPhone.prepareVerification();

    setStep(2);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl text-left font-bold mb-4">
          Enter your phone number
        </DialogTitle>
      </DialogHeader>
      <Form
        schema={phoneSchema}
        defaultValues={{
          phone: "",
        }}
        inputs={[
          {
            name: "phone",
            label: "Phone number",
            type: "phone",
          },
        ]}
        handleSubmit={sendTextVerification}
        btnText="Send code"
        btnLoadingText="Sending"
        showLabel={true}
        formStyles="space-y-2"
      />
    </>
  );
}
