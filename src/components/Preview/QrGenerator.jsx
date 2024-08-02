import QRCode from "react-qr-code";

const QrGenerator = ({ url }) => {
  const aux = url + "";
  return (
    <div style={{ height: "150px", paddingLeft:"10px", margin: "0 auto", width: "150px"}}>
      <QRCode
        size={256}
        style={{ height: "100%", width: "100%" }}
        value={aux}
        viewBox={`0 0 256 256`}
        fgColor="#15C0EA"
      />
    </div>
  )
}

export default QrGenerator