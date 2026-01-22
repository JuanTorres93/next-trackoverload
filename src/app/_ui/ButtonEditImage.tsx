import { HiMiniPencilSquare } from 'react-icons/hi2';

function ButtonEditImage({
  onImageUpload,
  ...props
}: {
  onImageUpload: (imageFile: File) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <label
        htmlFor="edit-recipe-image-button"
        className="flex items-center justify-center gap-2 p-3 transition rounded-full shadow-md cursor-pointer select-none bg-primary-shade opacity-70 text-neutral-50 hover:bg-primary-light disabled:text-zinc-400 disabled:border-zinc-400 disabled:bg-zinc-100 disabled:cursor-not-allowed"
      >
        <HiMiniPencilSquare className="text-3xl " />
      </label>

      <input
        type="file"
        className="sr-only"
        id="edit-recipe-image-button"
        data-testid="edit-recipe-image-button"
        name="new-recipe-image"
        accept="image/*"
        multiple={false}
        onChange={(e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          const imageFile = files[0];
          onImageUpload(imageFile);
        }}
      />
    </div>
  );
}

export default ButtonEditImage;
