<template>
    <div class="article-meta">
        <nuxt-link :to="{ name: 'profile', params: { username: article.author.username }}">
            <img :src="article.author.image" />
        </nuxt-link>
        <div class="info">
            <nuxt-link class="author" :to="{ name: 'profile', params: { username: article.author.username }}">
                {{ article.author.username }}
            </nuxt-link>
            <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
        </div>
        <template v-if="user.username === article.author.username">
            <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{ name: 'editor', query: { slug: article.slug } }">
                <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm" @click="removeArticle(article.slug)">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </template>
        <template v-else>
            <button class="btn btn-sm btn-outline-secondary"
                :class="{active: article.author.following}"
                :disabled="followDisabled"
                @click="onFollow(article.author)"
            >
                <i class="ion-plus-round"></i>
                &nbsp;
                {{ article.author.following ? 'Unfollow' : 'Follow'}} {{ article.author.username }}
            </button>
            &nbsp;&nbsp;
            <button
                class="btn btn-sm btn-outline-primary"
                :class="{active: article.favorited}"
                :disabled="favoriteDisabled"
                @click="onFavorite(article)"
            >
                <i class="ion-heart"></i>
                &nbsp;
                Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
            </button>
        </template>
    </div>
</template>

<script>
import { addFollow, deleteFollow, addFavorite, deleteFavorite, deleteArticle } from '@/api/article.js'
import { mapState } from 'vuex'

export default {
    name: 'ArticleMeta',
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            followDisabled: false,
            favoriteDisabled: false
        }
    },
    computed: {
        ...mapState(['user'])
    },
    head () {
        return {
            title: `${this.article.title} - realworld`,
            meta: [
                {
                    hid: 'description', // meta 的唯一标识，避免重复
                    name: 'description',
                    content: this.article.description
                }
            ]
        }
    },
    methods: {
        async onFavorite (article) {
            this.favoriteDisabled = true
            if (article.favorited) {
                await deleteFavorite(article.slug)
                article.favorited = false
                article.favoritesCount += -1
            } else {
                await addFavorite(article.slug)
                article.favorited = true
                article.favoritesCount += 1
            }
            this.favoriteDisabled = false
        },
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
        async removeArticle (slug) {
            await deleteArticle(slug)
            this.$router.push('/')
        }
    }
}

</script>
<style>
</style>