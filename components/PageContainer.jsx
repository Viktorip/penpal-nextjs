import { robotoMediumFont } from "@/app/fonts";

export default function PageContainer({children, className}) {

    return (
        <div className={`p-10 min-h-screen w-full bg-green-200 ${robotoMediumFont.className} ${className}`}>{children}</div>
    )
}