<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">

            <div class="col-md-6 offset-md-3 col-xs-12">
                <h1 class="text-xs-center">Your Settings</h1>

                <form>
                <fieldset>
                    <fieldset class="form-group">
                        <input v-model="image" class="form-control" type="text" placeholder="URL of profile picture" :disabled="disabled">
                    </fieldset>
                    <fieldset class="form-group">
                        <input v-model="username" class="form-control form-control-lg" type="text" placeholder="Your Name" :disabled="disabled">
                    </fieldset>
                    <fieldset class="form-group">
                        <textarea v-model="bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you" :disabled="disabled"></textarea>
                    </fieldset>
                    <fieldset class="form-group">
                        <input v-model="email" class="form-control form-control-lg" type="text" placeholder="Email" :disabled="disabled">
                    </fieldset>
                    <fieldset class="form-group">
                        <input v-model="password" class="form-control form-control-lg" type="password" placeholder="Password" :disabled="disabled" minlength="8">
                    </fieldset>
                    <button class="btn btn-lg btn-primary pull-xs-right" :disabled="disabled" @click.prevent="updateSettings">
                        Update Settings
                    </button>
                </fieldset>
                </form>
                <hr />
                <button class="btn btn-outline-danger" @click="logout">
                    Or click here to logout.
                </button>
            </div>

            </div>
        </div>
    </div>
</template>

<script>
import { getCurrentUser, updateUser } from '@/api/user.js'
import Cookies from 'js-cookie'

export default {
    middleware: ['authenticated'],
    name: 'SettingsIndex',
    async asyncData () {
        const { data } = await getCurrentUser()
        const { image='', username='', bio='', email='' } = data.user
        return {
            image,
            username,
            bio,
            email
        }
    },
    data () {
        return {
            password: null,
            disabled: false
        }
    },
    methods: {
        async updateSettings () {
            this.disabled = true
            await updateUser({
                user: {
                    image: this.image,
                    username: this.username,
                    bio: this.bio,
                    email: this.email,
                    password: this.password
                }
            })
            this.disabled = false
            this.$router.push(`/profile/${this.username}`)
        },
        logout () {
            this.$store.commit('setUser', null)
            Cookies.remove('user', { path: '' })
            this.$router.push('/')
        }
    }
}

</script>
<style>
</style>