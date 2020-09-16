<template>
    <div class="profile-page">

        <div class="user-info">
            <div class="container">
            <div class="row">

                <div class="col-xs-12 col-md-10 offset-md-1">
                    <img :src="profile.image" class="user-img" />
                    <h4>{{ profile.username }}</h4>
                    <p>
                        {{ profile.bio }}
                    </p>
                    <nuxt-link v-if="user.username === $route.params.username" class="btn btn-sm btn-outline-secondary action-btn" to="/settings">
                        <i class="ion-gear-a"></i> Edit Profile Settings
                    </nuxt-link>
                    <button v-else class="btn btn-sm btn-outline-secondary action-btn" :class="{ active: profile.following }" @click="onFollow(profile)" :disabled="followDisabled">
                        <i class="ion-plus-round"></i>
                        &nbsp;
                        Follow {{ $route.params.username }}
                    </button>
                </div>

            </div>
            </div>
        </div>

        <div class="container">
            <div class="row">

            <div class="col-xs-12 col-md-10 offset-md-1">
                <div class="articles-toggle">
                    <ul class="nav nav-pills outline-active">
                        <li class="nav-item">
                            <nuxt-link class="nav-link" :to="{ name: 'profile', query: { tab: 'my_articles' }}" exact>My Articles</nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link class="nav-link" :to="{ name: 'profile', query: { tab: 'favorited_articles' }}" exact>Favorited Articles</nuxt-link>
                        </li>
                    </ul>
                </div>

                <div v-for="article in articleList" class="article-preview" :key="article.slug">
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
                            :disabled="favoritedDisabled"
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

            </div>

            </div>
        </div>

    </div>
</template>

<script>
import { getProfile } from '@/api/user.js'
import { addFollow, deleteFollow, addFavorite, deleteFavorite, getArticles } from '@/api/article.js'
import { mapState } from 'vuex'

export default {
    name: 'ProfileIndex',
    async asyncData ({ query, params }) {
        const limit = 10
        const page = Number.parseInt(query.page || 1)
        const tab = query.tab || 'my_articles'

        const obj = {
            limit,
            offset: (page - 1) * limit
        }

        tab === 'my_articles' ? Object.assign(obj, { author: params.username }) : Object.assign(obj, { favorited: params.username }) 

        const [ profileRes, articlesRes ] = await Promise.all([
            getProfile(params.username),
            getArticles(obj)
        ])
        
        return {
            profile: profileRes.data.profile,
            articleList: articlesRes.data.articles,
            articlesCount: articlesRes.data.articlesCount,
            tab
        }
    },
    data () {
        return {
            articleList: [],
            articlesCount: 0,
            followDisabled: false,
            favoritedDisabled: false
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        async onFollow (author) {
            this.followDisabled = true
            if (author.following) {
                await deleteFollow(author.username)
                author.following = false
            } else {
                await addFollow(author.username)
                author.following = true
            }
            this.followDisabled = false
        },
        async onFavorite (article) {
            this.favoritedDisabled = true
            
            if (article.favorited) {
                await deleteFavorite(article.slug)
                article.favorited = false
                article.favoritesCount += -1
            } else {
                await addFavorite(article.slug)
                article.favorited = true
                article.favoritesCount += 1
            }
            this.favoritedDisabled = false
        }
    },
    watchQuery: ['page', 'tab']
}

</script>
<style>
</style>