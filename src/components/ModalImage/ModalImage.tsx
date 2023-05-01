interface Imodal {
  largeImage: { url: string; alt: string };
}
function ModalImage({ largeImage }: Imodal) {
  const { alt, url } = largeImage;
  return <img src={url} alt={alt} />;
}

export default ModalImage;
