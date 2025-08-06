document.getElementById('convertButton').addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files[0]) {
    alert("Please upload a JSON file first.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const json = JSON.parse(event.target.result);

      let convexOutput = "";
      let boxOutput = "";

      json.forEach(entry => {
        if (!entry.Properties || !entry.Properties.AggGeom) return;
        const geom = entry.Properties.AggGeom;

        // ✅ ConvexElems
        if (geom.ConvexElems) {
          const convexList = geom.ConvexElems.map(elem => {
            const vertices = elem.VertexData.map(v =>
              `(X=${v.X},Y=${v.Y},Z=${v.Z})`
            ).join(",");
            const indices = elem.IndexData.join(",");
            const min = elem.ElemBox.Min;
            const max = elem.ElemBox.Max;
            const elemBox = `ElemBox=(Min=(X=${min.X},Y=${min.Y},Z=${min.Z}),Max=(X=${max.X},Y=${max.Y},Z=${max.Z}),IsValid=True)`;
            return `(VertexData=(${vertices}),IndexData=(${indices}),${elemBox})`;
          });
          if (convexList.length > 0) {
            convexOutput = `ConvexElems=(${convexList.join(",")})`;
          }
        }

        // ✅ BoxElems
        if (geom.BoxElems) {
          const boxList = geom.BoxElems.map(elem => {
            const c = elem.Center;
            const r = elem.Rotation;
            return `(Center=(X=${c.X},Y=${c.Y},Z=${c.Z}),Rotation=(Pitch=${r.Pitch},Yaw=${r.Yaw},Roll=${r.Roll}),X=${elem.X},Y=${elem.Y},Z=${elem.Z})`;
          });
          if (boxList.length > 0) {
            boxOutput = `BoxElems=(${boxList.join(",")})`;
          }
        }
      });

      // Final Output Assembly
      const finalOutput = `(${boxOutput || "BoxElems="},${convexOutput || "ConvexElems="})`;
      document.getElementById("outputBox").value = finalOutput;
    } catch (e) {
      alert("Error processing file. Make sure it's a valid JSON from FModel.");
    }
  };

  reader.readAsText(fileInput.files[0]);
});

document.getElementById('copyButton').addEventListener('click', () => {
  const output = document.getElementById("outputBox").value;
  if (output) {
    navigator.clipboard.writeText(output);
  }
});
