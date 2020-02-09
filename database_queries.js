module.exports = {
    // getAllPersons should retrieve all person records
    // currently held.
    getAllPersons: async () => {
        // TODO: replace_me
        return [
            { id: 1, name: 'Alice', twitter: '@alice', lang: 'JavaScript' },
            { id: 2, name: 'Bob', twitter: '@bob', lang: 'Go' },
        ];
    },

    // savePerson should create a new person record and
    // return its `id`.
    savePerson: async (name, twitterHandle, favouriteLanguage) => {
        // TODO: replace_me
        console.log(`${new Date} [info] saving --> `, { name, twitterHandle, favouriteLanguage })

        return { id: 123 };
    },

    // deletePerson should delete a person record and
    // return true or false depending of if it succeeded.
    deletePerson: async (id) => {
        // TODO: replace_me
        console.log(`${new Date} [info] deleting -> `, { id })

        return true;
    },
};
