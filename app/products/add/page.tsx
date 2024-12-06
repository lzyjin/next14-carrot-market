"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import {PhotoIcon} from "@heroicons/react/16/solid";
import {useState} from "react";
import {getUploadUrl, uploadProduct} from "@/app/products/add/actions";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {productSchema, ProductType} from "@/app/products/add/schema";

interface FileTypes {
  [key: string]: boolean;
}

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {register, handleSubmit, setValue, formState: {errors}} = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {target: {files}} = e;

    if (!files) {
      return;
    }

    const file = files[0];
    const fileType = file?.type;
    const fileSize = file?.size;
    const imgFileTypes: FileTypes = {
      "image/jpg": true,
      "image/jpeg": true,
      "image/png": true,
    };

    // 코드챌린지: 확인사항 2개
    // 1. 사용자가 이미지를 업로드했는지. 다른 파일은 아닌지
    if (!imgFileTypes[fileType]) {
      return;
    }

    // 2. 이미지 사이즈가 대략 3mb 이하인지
    if (fileSize > 3145728) {
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);
    setFile(file);

    // upload url 받아옴
    const {success, result} = await getUploadUrl();

    if (success) {
      const {id, uploadURL} = result;
      setUploadUrl(uploadURL);
      setValue("photo", `https://imagedelivery.net/1je7nw4Nf7Ja9TVwdeU_Zg/${id}`);
    }
  };

  // upload image
  const onSubmit = handleSubmit(
    // data는 validation을 마친 데이터
    async (data: ProductType) => {
      // 1. upload image to cloudflare(uploadURL로 POST 요청 보내기)
      if (!file) {
        return;
      }

      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });

      if (response.status !== 200) {
        return;
      }

      // 2. replace `photo` in formData(db에 저장하기 위해 File 타입 이미지를 string 타입 이미지로 변경)
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price + "");
      formData.append("description", data.description);
      formData.append("photo", data.photo);

      // 3. call upload product(uploadProduct에서 error를 반환할 수 있으므로 함수 자체를 return해야 함)
      const errors = await uploadProduct(formData);

      if (errors) {
        // setError("")
      }
    }
  );

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 border-neutral-300 border-dashed rounded-md aspect-square
            flex flex-col justify-center items-center text-neutral-300 cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`
          }}
        >
          {
            preview === "" ?
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해 주세요.
                {errors.photo?.message}
              </div>
            </>
            :
            null
          }
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
          required
        />

        <Input type="text" {...register("title")} required placeholder="제목" errors={[errors.title?.message ?? ""]} />
        <Input type="number" {...register("price")} required placeholder="가격" errors={[errors.price?.message ?? ""]} />
        <Input type="text" {...register("description")} required placeholder="자세한 설명" errors={[errors.description?.message ?? ""]} />

        <Button text="작성 완료" />
      </form>
    </div>
  );
}