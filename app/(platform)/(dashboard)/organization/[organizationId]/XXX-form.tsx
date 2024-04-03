"use client";

/* import { create } from "@/actions/create-board"; */
import { createBoard } from "@/actions/create-board";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";

import { FormSubmit } from "@/components/form/form-submit";

export default function Form() {
  /* const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(create, initialState); */

  const {execute, fieldErrors} = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, "Success");
    },
    onError: (error) => {
      console.error(error);
    }
  
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    execute({ title });
  }

  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput errors={fieldErrors}
          id="title"
          label="Board title"
          type="text"
          placeholder="Board title"
          required
        />
      </div>

      <FormSubmit
        variant="default"
      >
        Save
      </FormSubmit>
    </form>
  );
}
