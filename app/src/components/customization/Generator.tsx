import {
  useCustomization,
  type ColorOption,
  type ShoePart,
} from "@/contexts/CustomizationContext";

export const Generator = () => {
  const { changePartColors } = useCustomization();

  const handleGenerateClick = async () => {
    const response = await fetch(
      "http://127.0.0.1:54321/functions/v1/generate-shoes-color",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "I wanna all red shoes!",
        }),
      },
    );

    const colors = (await response.json()) as Record<
      ShoePart["id"],
      ColorOption["id"]
    >;

    changePartColors(colors);
  };

  return (
    <button
      type="button"
      className="fixed bottom-10 right-10"
      onClick={() => {
        void handleGenerateClick();
      }}
    >
      GENERATE
    </button>
  );
};
