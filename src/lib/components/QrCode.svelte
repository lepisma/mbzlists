<script>
  import { onMount } from 'svelte';
  import QRCodeStyling from "qr-code-styling";

  let { viewId } = $props();

  let qrCode;
  onMount(() => {
    qrCode = new QRCodeStyling({
      width: 150,
      height: 150,
      data: `https://mbzlists.com/list/${viewId}`,
      image: '/mb-logo.png',
      dotsOptions: {
        color: "#bb4590",
        type: "rounded"
      },
      cornersDotOptions: {
        color: "#ec7538"
      },
      cornersSquareOptions: {
        color: "#ec7538"
      },
      backgroundOptions: {
        color: 'transparent'
      }
    });
    qrCode.append(document.getElementById("qr-code"));
  });
</script>

<div id="qr-code"></div>
