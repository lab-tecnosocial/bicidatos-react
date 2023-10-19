import QRCode from "react-qr-code";

const QrGenerator = ({ url }) => {
  const aux = url + "";
  return (
    <div style={{ height: "auto", paddingLeft:"10px", margin: "0 auto", maxWidth: 150, width: "100%"}}>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={aux}
        viewBox={`0 0 256 256`}
        fgColor="#15C0EA"
      />
    </div>
  )
}

export default QrGenerator