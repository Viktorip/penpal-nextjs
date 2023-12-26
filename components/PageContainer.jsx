import { robotoMediumFont } from "@/app/fonts";

export default function PageContainer({children, className}) {

    return (
        <div className={`flex justify-center min-h-full w-full pt-2 ${robotoMediumFont.className} ${className}`}>{children}</div>
    )
}