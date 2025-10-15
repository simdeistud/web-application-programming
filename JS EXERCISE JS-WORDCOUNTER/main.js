function wordCounter(s=""){
    words = s.split(" ")
    freq = []
    words.forEach(element => {
        if (freq[element] === undefined) {
            freq[element] = 1;
        } else {
            freq[element] = freq[element] + 1;
        }
    });
    for(e in freq){
        freq[e] = freq[e] + "/" + words.length
    }
    return freq
}