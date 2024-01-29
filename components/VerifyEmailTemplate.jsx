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
            color: "rgb(49 46 129)",
            padding: "8px",
            position: "relative"
        },
        backgroundImg: {
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "-1"
        }
    }

    return (
        <div>
            <img src="https://swfozb1ng6po0bsb.public.blob.vercel-storage.com/email_banner-TiVMIdxRUEDlk61DcCbkkPt5J1cIhr.png" alt="banner"></img>
            <div style={styles.body}>
                <img style={styles.backgroundImg} src="https://swfozb1ng6po0bsb.public.blob.vercel-storage.com/email_background-KTh9ADiY7vJ0MzAcOxZHwwIbzec7rp.png" alt="background"></img>
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
                <br />
                <p style={styles.linkContainer}><a href={verifyLink}>{verifyLink}</a></p>
            </div>
        </div>
    )
}