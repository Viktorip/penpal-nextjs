import PageContainer from "@/components/PageContainer";


export default async function LogoutPage() {
    const success = true;

    return (
        <PageContainer>
            {success ?
                <div>Succesfully signed out</div>
                :
                <div>Sorry something went wrong</div>
            }
        </PageContainer>
    )
} 