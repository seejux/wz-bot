const axios = require('axios');

const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijc4MDdlYjE0LTE0YjItNGJlYy1hMjRhLTQzM2VmYjZiYjY1ZSIsImlhdCI6MTcwMDc4MDI0OSwic3ViIjoiZGV2ZWxvcGVyLzM3NjlmMTEyLTliMDUtZTllOS01ZDE3LTJlOGYzMjc4NDY3MyIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjIyMy4xMjMuMTQuMzQiXSwidHlwZSI6ImNsaWVudCJ9XX0.ldkLQNasbrNQZYMkgoOx02aFO1LXXAfc5XCnqtImNejld8eooDK0ofLuDwDV6ThtpELyhaaRCcw_bsE7ujyvsA"
// Assuming storedTag is the user's tag (retrieve it from your storage)
async function getClanWarStats(storedTag) {
    if(storedTag.startsWith("#")) storedTag = storedTag.substring(1);
    // const apiUrl = `https://api.clashking.xyz/player/%23${storedTag}/stats`;
    const apiUrl = `https://api.clashofclans.com/v1/clans/%23${storedTag}/currentwar`;
    
    console.log(apiUrl);
    
    try {
        const response = await axios.get(apiUrl,{
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });
        // Handle the API response
        console.log(response.data);
        return response.data;
    } catch (error) {
        // Handle errors
        console.error(error);
        throw error; // Re-throw the error to propagate it to the caller
    }
}

module.exports = {
    getClanWarStats
};