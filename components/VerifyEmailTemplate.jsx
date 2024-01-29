import t from "@/lib/localization";




export default function VerifyEmailTemplate({ email, fullname, loc, verifyLink }) {
    const styles = {
        button: {
            border: "1px solid white",
            backgroundColor: "lightblue",
            textAlign: "center",
            fontSize: "16px",
            padding: "16px",
            borderRadius: "6px",
        },
        buttonCont: {
            width: "50%",
            margin:"0 25% 0 25%"

        },
        linkInfo: {
            fontSize: "12px"
        },
        linkContainer: {
            fontSize: "12px"
        },
        body: {
            color: "rgb(49 46 129)",
            padding: "8px",
            textAlign: "justify",
        },
        paragraph: {
            fontSize: "16px"
        }
    }

    return (
        <div>
            <img src="https://swfozb1ng6po0bsb.public.blob.vercel-storage.com/email_banner-TiVMIdxRUEDlk61DcCbkkPt5J1cIhr.png" alt="banner"></img>
            <div style={styles.body}>
                <p style={styles.paragraph}>{fullname}, {t('verify_email_body1', loc)}</p>
                <br />
                <p style={styles.paragraph}>{t('verify_email_body2', loc)} ( {email} )</p>
                <br />
                <div style={styles.buttonCont}>
                    <a href={verifyLink}><div style={styles.button}>{t('verify_email_verify', loc)}</div></a>
                </div>
                <br />
                <br />
                <p style={styles.linkInfo}>{t('verify_email_manual_link', loc)}</p>
                <br />
                <p style={styles.linkContainer}><a href={verifyLink}>{verifyLink}</a></p>
            </div>
        </div>
    )
}