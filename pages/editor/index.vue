<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">

                <div class="col-md-10 offset-md-1 col-xs-12">
                    <form>
                        <fieldset>
                            <fieldset class="form-group">
                                <input v-model="title" type="text" class="form-control form-control-lg" placeholder="Article Title">
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="description" type="text" class="form-control" placeholder="What's this article about?">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea v-model="body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="tag" type="text" class="form-control" placeholder="Enter tags" @keyup.enter="addTag">
                                <div class="tag-list">
                                    <span v-for="(tag, index) in tagList" :key="index" class="tag-default tag-pill">
                                        <i class="ion-close-round" @click="tagList.splice(index, 1)"></i>
                                        {{ tag }}
                                    </span>
                                </div>
                            </fieldset>
                            <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click.prevent="publishArticle">
                                Publish Article
                            </button>
                        </fieldset>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { createArticle, updateArticle, getArticle } from '@/api/article.js'

export default {
    // 在路由匹配组件渲染之前会执行中间件处理
    middleware: ['authenticated'],
    name: 'EditorIndex',
    async asyncData ({ query }) {
        if (query.slug) {
            const { data } = await getArticle(query.slug)
            const { title, description, body, tagList } = data.article
            return {
                title,
                description,
                body,
                tagList
            }
        }
        return {
            title: '',
            description: '',
            body: '',
            tagList: []
        }
    },
    data () {
        return {
            title: '',
            description: '',
            body: '',
            tag: '',
            tagList: []
        }
    },
    watchQuery: ['slug'],
    methods: {
        async publishArticle () {
            const { slug } = this.$route.query

            const subArticle = slug ? updateArticle : createArticle

            const { data } = await subArticle(slug, {
                article: {
                    title: this.title,
                    description: this.title,
                    body: this.body,
                    tagList: this.tagList
                }
            })
            this.$router.push({
                name: 'article',
                params: {
                    slug: data.article.slug
                }
            })
        },
        addTag () {
            const tag = this.tag
            const tagIndex = this.tagList.findIndex(item => item === tag)
            
            if (tagIndex === -1 && tag !== '') {
                this.tagList.push(tag)
                this.tag = ''
            }
        }
    }
}

</script>
<style>
</style>