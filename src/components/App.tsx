import { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar";
import ImageGallery from "./ImageGallery/ImageGallery";
import Button from "./Button/Button";
import Loader from "./Loader/Loader";
import Modal from "./Modal/Modal";
import ModalImage from "./ModalImage/ModalImage";
import Message from "./Message/Message";
import imageApi from "../service/api.js";
import scrollDown from "../service/scroll";
import datafilter from "../service/datafilter";
import { IData, IgetLargeImage, IImage } from "./interfaces/interfaces";

export default function App() {
  const [images, setImages] = useState<IImage[]>([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState<IgetLargeImage>({ url: "", alt: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(false);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const data = await imageApi(keyword, page);
      if (!data.total) {
        throw new Error("Sorry. There is no photos on your request.");
      }
      const dataImages = data.hits.map((hit: IImage) => datafilter(hit));
      setImages([...images, ...dataImages]);
      setPage(page + 1);
      setMessage("");
      isLastPage(data);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!keyword) {
      return;
    }

    fetchImage();
  }, [keyword]);

  useEffect(() => {
    if (page > 2) {
      scrollDown();
    }
  }, [page]);

  const onSubmitForm = (query: string) => {
    if (!query) return;
    setKeyword(query);
    setPage(1);
    setImages([]);
    setLoading(false);
  };

  const saveLargeImage = (largeImageURL: IgetLargeImage) => {
    setLargeImageURL({ url: largeImageURL.url, alt: largeImageURL.alt });
  };

  const hideLargeImage = () => {
    setLargeImageURL({ url: "", alt: "" });
  };

  const isLastPage = (data: IData) => {
    if (images.length === data.totalHits) {
      setLastPage(true);
    }
  };

  console.log(largeImageURL);
  return (
    <>
      <SearchBar onSubmitForm={onSubmitForm} />
      {images.length > 0 && <ImageGallery images={images} onImageClick={saveLargeImage} />}
      {largeImageURL.url && (
        <Modal onCloseModal={hideLargeImage}>
          <ModalImage largeImage={largeImageURL} />
        </Modal>
      )}
      {images.length >= 11 && !lastPage && !loading && <Button text='Load more' buttonAction={fetchImage} />}
      {loading && <Loader />}
      {message && <Message message={message} />}
    </>
  );
}
