<template>
    <div class="home-page">

        <div class="banner">
            <div class="container">
            <h1 class="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
            </div>
        </div>

        <div class="container page">
            <div class="row">

            <div class="col-md-9">
                <div class="feed-toggle">
                    <ul class="nav nav-pills outline-active">
                        <li v-if="user" class="nav-item">
                            <nuxt-link
                                exact
                                class="nav-link"
                                :class="{
                                    active: tab === 'your_feed'
                                }"
                                :to="{
                                    name: 'home',
                                    query: {
                                        tab: 'your_feed'
                                    }
                                }"
                            >
                                Your Feed
                            </nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link
                                exact
                                class="nav-link"
                                :class="{
                                    active: tab === 'global_feed'
                                }"
                                :to="{
                                    name: 'home'
                                }"
                            >
                                Global Feed
                            </nuxt-link>
                        </li>
                        <li v-if="tag" class="nav-item">
                            <nuxt-link
                                exact
                                class="nav-link"
                                :class="{
                                    active: tab === 'tag'
                                }"
                                :to="{
                                    name: 'home',
                                    query: {
                                        tab: 'tag',
                                        tag: tag
                                    }
                                }"
                            >
                                # {{ tag }}
                            </nuxt-link>
                        </li>
                    </ul>
                </div>

                <div v-for="article in articles" class="article-preview" :key="article.slug">
                    <div class="article-meta">
                        <nuxt-link
                            :to="{
                                name: 'profile',
                                params: { username: article.author.username }
                            }"
                        >
                            <img :src="article.author.image" />
                        </nuxt-link>
                        <div class="info">
                            <nuxt-link
                                :to="{
                                    name: 'profile',
                                    params: { username: article.author.username }
                                }"
                                class="author"
                            >
                                {{ article.author.username }}
                            </nuxt-link>
                            <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
                        </div>
                        <button
                            class="btn btn-outline-primary btn-sm pull-xs-right"
                            :class="{
                                active: article.favorited
                            }"
                            @click="onFavorite(article)"
                            :disabled="article.favoritedDisabled"
                        >
                            <i class="ion-heart"></i> {{ article.favoritesCount }}
                        </button>
                    </div>
                    <nuxt-link
                        class="preview-link"
                        :to="{
                            name: 'article',
                            params: {
                                slug: article.slug
                            }
                        }"
                    >
                        <h1>{{ article.title }}</h1>
                        <p>{{ article.description }}</p>
                        <span>Read more...</span>
                        <ul class="tag-list">
                            <li v-for="(tag, index) in article.tagList" :key="index" class="tag-default tag-pill tag-outline">
                                {{ tag }}
                            </li>
                        </ul>
                    </nuxt-link>
                </div>

                <nav>
                    <ul class="pagination">
                        <li
                            v-for="item in totalPage"
                            :key="item"
                            class="page-item"
                            :class="{
                                active: item === page
                            }"
                        >
                            <nuxt-link
                                class="page-link"
                                :to="{
                                    name: 'home',
                                    query: {
                                        page: item,
                                        tag: $route.query.tag,
                                        tab: tab
                                    }
                                }"
                            >
                                {{ item }}
                            </nuxt-link>
                        </li>
                    </ul>
                </nav>

            </div>

            <div class="col-md-3">
                <div class="sidebar">
                <p>Popular Tags</p>

                <div class="tag-list">
                    <nuxt-link
                        class="tag-pill tag-default"
                        v-for="item in tags"
                        :key="item"
                        :to="{
                            name: 'home',
                            query: {
                                tag: item,
                                tab: 'tag'
                            }
                        }"
                    >
                        {{ item }}
                    </nuxt-link>
                </div>
                </div>
            </div>

            </div>
        </div>

    </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from '@/api/article.js'
import { getTags } from '@/api/tag.js'
import { mapState } from 'vuex'

export default {
    name: 'HomeIndex',
    async asyncData ({ query }) {

        const page = Number.parseInt(query.page || 1)

        const limit = 10

        const tab = query.tab || 'global_feed'
        const tag = query.tag

        const loadArticles = tab !== 'your_feed'
        ? getArticles
        : getFeedArticles

        const [ articleRes, tagRes ] = await Promise.all([
            loadArticles({
                limit,
                offset: (page - 1) * limit,
                tag
            }),
            getTags()
        ])

        const { articles, articlesCount } = articleRes.data
        const { tags } = tagRes.data

        articles.forEach(article => article.favoritedDisabled = false)

        return {
            articles,
            articlesCount,
            page,
            limit,
            tags,
            tab,
            tag
        }

    },
    watchQuery: ['page', 'tag', 'tab'],
    computed: {
        ...mapState(['user']),
        totalPage () {
            return Math.ceil(this.articlesCount / this.limit)
        },

    },
    methods: {
        async onFavorite (article) {
            article.favoritedDisabled = true
            if (article.favorited) {
                await deleteFavorite(article.slug)
                article.favorited = false
                article.favoritesCount += -1
            } else {
                await addFavorite(article.slug)
                article.favorited = true
                article.favoritesCount += 1
            }
            article.favoritedDisabled = false
        }
    }
}

</script>
<style>
</style>