import VueI18n from "vue-i18n";
import Vue from "vue";

Vue.use(VueI18n);

export default new VueI18n({
    locale: 'zh', // 语言标识
    messages: {
        zh: require('./language/zh-CN'),
        en: require('./language/en-US'),
    }
});
