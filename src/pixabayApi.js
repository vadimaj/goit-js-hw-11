import axios, { Axios } from 'axios';
const BASIC_URL = 'https://pixabay.com/api';
const KEY = '34291894-c5b60193cb7b58e4e154e577d';
const PICTURES_PER_PAGE = 40;
export default class PixabayApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }
  //// function using Promises///

  // fetchPictures() {
  //   return fetch(
  //     `${BASIC_URL}/?key=${KEY}&q=${this.searchQuery}&image_type=photo&lang=en&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
  //   )
  //     .then(response => response.json())
  //     .then(pictures => {
  //       this.incrementPage();
  //       return pictures.hits;
  //     });
  // }

  //// function using Async Await///

  // async fetchPictures() {
  //   const response = await fetch(
  //     `${BASIC_URL}/?key=${KEY}&q=${this.searchQuery}&image_type=photo&lang=en&orientation=horizontal&safesearch=true&per_page=${PICTURES_PER_PAGE}&page=${this.page}`
  //   );

  //   const pictures = await response.json();
  //   this.totalHits = pictures.totalHits;
  //   this.incrementPage();

  //   return pictures.hits;
  // }

  async fetchPictures() {
    try {
      const response = await axios.get(
        `${BASIC_URL}/?key=${KEY}&q=${this.searchQuery}&image_type=photo&lang=en&orientation=horizontal&safesearch=true&per_page=${PICTURES_PER_PAGE}&page=${this.page}`
      );
      this.totalHits = response.data.totalHits;
      this.incrementPage();
      return response.data.hits;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  isEndOfCollection() {
    return Math.ceil(this.totalHits / PICTURES_PER_PAGE) === this.page - 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
}
