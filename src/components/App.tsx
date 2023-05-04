import { useState, useEffect, useCallback } from 'react';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import ModalImage from './ModalImage/ModalImage';
import Message from './Message/Message';
import imageApi from '../service/api.js';
import scrollDown from '../service/scroll';
import datafilter from '../service/datafilter';
import { IData, IgetLargeImage, IImage } from './interfaces/interfaces';

export default function App() {
  const [images, setImages] = useState<IImage[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState<IgetLargeImage>({ url: '', alt: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(false);

  const isLastPage = useCallback(
    (data: IData) => {
      if (images.length === data.totalHits) setLastPage(true);
    },
    [images.length],
  );

  const fetchImage = useCallback(
    async (keyword: string, page: number) => {
      try {
        setLoading(true);
        const data = await imageApi(keyword, page);
        if (!data.total) {
          throw new Error('Sorry. There is no photos on your request.');
        }
        const dataImages = data.hits.map((hit: IImage) => datafilter(hit));
        setImages((images) => [...images, ...dataImages]);
        isLastPage(data);
      } catch (error: any) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    },
    [isLastPage],
  );
  useEffect(() => {
    if (!keyword) return;
    setMessage('');
    fetchImage(keyword, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, page]);

  useEffect(() => {
    if (images.length >= 2) scrollDown();
  }, [images.length]);

  const onSubmitForm = (query: string) => {
    if (!query) return;
    setKeyword(query);
    setPage(1);
    setImages([]);
  };

  const saveLargeImage = (largeImageURL: IgetLargeImage) => {
    setLargeImageURL({ url: largeImageURL.url, alt: largeImageURL.alt });
  };

  const hideLargeImage = () => {
    setLargeImageURL({ url: '', alt: '' });
  };

  const onLoadMore = () => {
    setPage((page) => page + 1);
  };

  return (
    <>
      <SearchBar onSubmitForm={onSubmitForm} />
      {images.length > 0 && <ImageGallery images={images} onImageClick={saveLargeImage} />}
      {largeImageURL.url && (
        <Modal onCloseModal={hideLargeImage}>
          <ModalImage largeImage={largeImageURL} />
        </Modal>
      )}
      {images.length > 12 && !lastPage && !loading && (
        <Button text='Load more' buttonAction={onLoadMore} />
      )}
      {loading && <Loader />}
      {message && <Message message={message} />}
    </>
  );
}
