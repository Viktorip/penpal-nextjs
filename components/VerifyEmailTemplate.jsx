import t from "@/lib/localization";




export default function VerifyEmailTemplate({ email, fullname, loc, verifyLink }) {
    const styles = {
        button: {
            border: "1px solid white",
            backgroundColor: "lightblue",
            textAlign: "center",
            fontSize: "14px",
            padding: "16px",
            borderRadius: "6px",
        },
        buttonCont: {
            width: "50%",
            margin:"auto"

        },
        linkInfo: {
            fontSize: "10px"
        },
        linkContainer: {
            fontSize: "10px"
        },
        body: {
            backgroundImage: 'url("https://swfozb1ng6po0bsb.public.blob.vercel-storage.com/email_background-KTh9ADiY7vJ0MzAcOxZHwwIbzec7rp.png")',
            color: "rgb(49 46 129)",
            padding: "8px"
        }
    }

    return (
        <div>
            <img src="https://swfozb1ng6po0bsb.public.blob.vercel-storage.com/email_banner-TiVMIdxRUEDlk61DcCbkkPt5J1cIhr.png" alt="banner"></img>
            <div style={styles.body}>
                <h1>{t('verify_email_title', loc)}</h1>
                <br />
                <p>{fullname}, {t('verify_email_body1', loc)}</p>
                <br />
                <p>{t('verify_email_body2', loc)} ( {email} )</p>
                <br />
                <div style={styles.buttonCont}>
                    <a href={verifyLink}><div style={styles.button}>{t('verify_email_verify', loc)}</div></a>
                </div>
                <br />
                <br />
                <p style={styles.linkInfo}>{t('verify_email_manual_link', loc)}</p>
                <p style={styles.linkContainer}><a href={verifyLink}>{verifyLink}</a></p>
            </div>
        </div>
    )
}