<script lang='ts'>
  import { onMount } from 'svelte';
  import QRCodeStyling from 'qr-code-styling';

  let { viewId } = $props();

  let largeQrHref = $state('');

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  }

  function genQrCode(size: number) {
    return new QRCodeStyling({
      width: size,
      height: size,
      data: `https://mbzlists.com/list/${viewId}`,
      image: '/mb-logo.png',
      dotsOptions: {
        color: '#bb4590',
        type: 'rounded'
      },
      cornersDotOptions: {
        color: '#ec7538'
      },
      cornersSquareOptions: {
        color: '#ec7538'
      },
      backgroundOptions: {
        color: 'transparent'
      }
    });
  }

  async function genLargeQrDataURL() {
    let qrCode =  genQrCode(300);
    let blob = await qrCode.getRawData('png');
    return await blobToDataURL(blob);
  }

  onMount(async  () => {
    let qrCode = genQrCode(150);
    qrCode.append(document.getElementById('qr-code'));

    largeQrHref = await genLargeQrDataURL();
  });
</script>

<a id="qr-code" href={largeQrHref} target="_blank"></a>
