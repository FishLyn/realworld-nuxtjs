<template>
  <div>
        <form class="card comment-form" v-if="user">
            <div class="card-block">
                <textarea v-model="commentBody" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
                <img :src="article.author.image" class="comment-author-img" />
                <button
                    class="btn btn-sm btn-primary"
                    @click.prevent="clickToAddComment(article)"
                >
                    Post Comment
                </button>
            </div>
        </form>
        <p style="display: inherit;" v-else>
          <nuxt-link to="/login">Sign in</nuxt-link> or <nuxt-link to="/register">sign up</nuxt-link> to add comments on this article.
        </p>
        
        <div class="card" v-for="comment in comments" :key="comment.id">
            <div class="card-block">
                <p class="card-text">{{ comment.body }}</p>
            </div>
            <div class="card-footer">
                <nuxt-link :to="{ name: 'profile', params: { username: comment.author.username }}" class="comment-author">
                    <img :src="comment.author.image" class="comment-author-img" />
                </nuxt-link>
                &nbsp;
                <nuxt-link :to="{ name: 'profile', params: { username: comment.author.username }}" class="comment-author">
                    {{ comment.author.username }}
                </nuxt-link>
                <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
                <span class="mod-options" v-if="isDeleteBtn(comment.author.username)">
                    <i class="ion-trash-a" @click="clickToDeleteComment(article.slug, comment.id)"></i>
                </span>
            </div>
        </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from '@/api/article.js'
import { mapState } from 'vuex'

export default {
    name: 'ArticleComments',
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            comments: [],
            commentBody: ''
        }
    },
    methods: {
        async clickToAddComment (article) {
            try {
                const { data } = await addComment(article.slug, {'comment': {'body': this.commentBody}})
                this.commentBody = ''
                this.comments.unshift(data.comment)
            } catch (err) {
                throw(new Error(err))
            }
        },
        async clickToDeleteComment (slug, commentId) {
            try {
                await deleteComment(slug, commentId)
                const delCommentIndex = this.comments.findIndex(item => item.id === commentId)
                this.comments.splice(delCommentIndex, 1)
            } catch (err) {
                throw(new Error(err))
            }
        }
    },
    computed: {
        ...mapState(['user']),
        isDeleteBtn () {
            return username => {
                const { user } = this.$store.state
                return username === (user && user.username)
            }
        }
    },
    async mounted () {
        const { data } = await getComments(this.article.slug)
        this.comments = data.comments
    }
}

</script>
<style>
</style>