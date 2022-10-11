<template>
    <div id="app" class="bg-gray-700 h-screen w-screen overflow-hidden">
        <div class="w-full h-full px-10 sm:px-20 lg:px-36 transition-all">
            <Chat v-if="user"></Chat>
            <Login v-else></Login>
        </div>
    </div>
</template>
<script>
import Chat from "./components/Chat.vue";
import Login from "./components/Login.vue";
import firebase from 'firebase/compat/app'

export default {
    created() {
         // authentication on app load
        firebase.auth().onAuthStateChanged(async (user) => {
            await this.$store.dispatch("updateUser", user);
        });

        // realtime updating of messages
        this.$store.getters.db.collection("messages").orderBy("createdAt", "desc").onSnapshot(async (snapshot) => {
            const messages = await snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });
            console.log(messages)
            await this.$store.dispatch("updateMsg", messages);
        });
    },
    components: {
        Chat,
        Login
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
};
</script>

<style lang="scss">
body {
    color: white;
    font-family: "Fira Code", "JetBrains Mono", 'Roboto Mono', monospace;
}
input {
    color: black !important;
}
</style>>

