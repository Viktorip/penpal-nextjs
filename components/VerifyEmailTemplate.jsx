import t from "@/lib/localization";




export default function VerifyEmailTemplate({ email, fullname, loc, verifyLink }) {
    const styles = {
        button: {
            border: "2px solid darkblue",
            backgroundColor: "lightblue",
            textAlign: "center",
            fontSize: "14px",
            padding: "16px",
            borderRadius: "6px"
        },
        linkInfo: {
            fontSize: "10px"
        },
        linkContainer: {
            fontSize: "10px"
        }
    }

    return (
        <div>
            <h1>{t('verify_email_title', loc)}</h1>
            <p>{fullname}, {t('verify_email_body1', loc)}</p>
            <p>{t('verify_email_body2', loc)} ( {email} )</p>
            <a href={verifyLink}><div style={styles.button}>{t('verify_email_verify', loc)}</div></a>
            <p style={styles.linkInfo}>{t('verify_email_manual_link', loc)}</p>
            <p style={styles.linkContainer}><a href={verifyLink}>{verifyLink}</a></p>
        </div>
    )
}