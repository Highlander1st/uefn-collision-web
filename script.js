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
      const convexElems = json[0].Properties.AggGeom.ConvexElems;

      let output = "(SphereElems=,BoxElems=,SphylElems=,ConvexElems=(\n";

      convexElems.forEach(elem => {
        const vertices = elem.VertexData.map(v =>
          `(X=${v.X},Y=${v.Y},Z=${v.Z})`
        ).join(",");

        const indices = elem.IndexData.join(",");

        const min = elem.ElemBox.Min;
        const max = elem.ElemBox.Max;

        const elemBox = `ElemBox=(Min=(X=${min.X},Y=${min.Y},Z=${min.Z}),Max=(X=${max.X},Y=${max.Y},Z=${max.Z}),IsValid=True)`;

        output += `(${`VertexData=(${vertices}),IndexData=(${indices}),${elemBox}`}),\n`;
      });

      output += "))";

      document.getElementById("outputBox").value = output;
    } catch (e) {
      alert("Error processing file. Make sure it's a valid FModel-exported JSON.");
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

