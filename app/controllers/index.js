import Ember from 'ember';
import _ from 'lodash/lodash';

const { computed } = Ember;

/* global ImgixClient */

export default Ember.Controller.extend({
  queryParams: ['phrase'],

  phrase: null,

  imageUrl: computed('phrase', function() {
    let opts = {};

    if (this.get('phrase')) {
      opts = {
        mark64: this.get('_client').buildURL("/~text", {
          txt64: this.get('phrase').toUpperCase(),
          txtsize: 16,
          bg: "fff",
          w: 162,
          h: 62
        }),
        markx: 58,
        marky: 332
      };
    }

    return this.get('_client').buildURL(this.get('_path'), opts);
  }),

  linkUrl: computed('imageUrl', function () {
    return this.get('imageUrl').includes('mark64') ? this.get('imageUrl') : null;
  }),

  _debouncedSetPhrase: computed(function() {
    return _.debounce((newValue) => {
      this.set('phrase', newValue);
    }, 500);
  }),

  _path: "/wp-content/uploads/2015/01/intelligent.png",

  _client: computed(function() {
    return new ImgixClient({ host: "searchcontinues.imgix.net" });
  }),

  actions: {
    inputChanged(newValue) {
      this.get('_debouncedSetPhrase')(newValue);
    },

    textareaClicked() {
      Ember.$('textarea').select();
    }
  }
});
