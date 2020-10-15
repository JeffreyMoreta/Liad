var chatMessages = [
    {
        name: "ms1",
        msg: "Yo! Have you seen Tenet?",
        delay: 300,
        align: "right",
        showTime: true,
        time: "19:58",
        img: "assets/img/author-image/8.jpg"
    },
    {
        name: "ms2",
        msg: "Yeah, it was alright...",
        delay: 3000,
        align: "left",
        showTime: true,
        time: "19:58",
        img: "assets/img/author-image/7.jpg"
    },
    {
        name: "ms3",
        msg: "Alright!? You're out of your mind!",
        delay: 3000,
        align: "right",
        showTime: true,
        time: "19:58",
        img: "assets/img/author-image/8.jpg"
    },
    {
        name: "ms4",
        msg: "What are you doing? I'm leaving.",
        delay: 2000,
        align: "left",
        showTime: true,
        time: "19:58",
        img: "assets/img/author-image/7.jpg"
    },
    {
        name: "ms5",
        msg: "No please don't leave. Isolation has changed me, I swear!",
        delay: 3000,
        align: "right",
        showTime: true,
        time: "19:58",
        img: "assets/img/author-image/8.jpg"
    },
];
var chatDelay = 0;

function onRowAdded() {
    $('.chat-container').animate({
        scrollTop: $('.chat-container').prop('scrollHeight')
    });
};
$.each(chatMessages, function(index, obj) {
    chatDelay = chatDelay + 1000;
    chatDelay2 = chatDelay + obj.delay;
    chatDelay3 = chatDelay2 + 10;
    scrollDelay = chatDelay;
    chatTimeString = " ";
    msgname = "." + obj.name;
    msginner = ".messageinner-" + obj.name;
    spinner = ".sp-" + obj.name;
    if (obj.showTime == true) {
        chatTimeString = "<span class='message-time'>" + obj.time + "</span>";
    }
    $(".chat-message-list").append("<li class='message-" + obj.align + " " + obj.name + "' hidden><div class='sp-" + obj.name + "'><span class='spinme-" + obj.align + "'><div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></span></div><div class='messageinner-" + obj.name + "' hidden><img src='" + obj.img +"'><span class='message-text'>" + obj.msg + chatTimeString + "</span></div></li>");

    $(msgname).delay(chatDelay).fadeIn();
    $(spinner).delay(chatDelay2).hide(1);
    $(msginner).delay(chatDelay3).fadeIn();
    setTimeout(onRowAdded, chatDelay);
    setTimeout(onRowAdded, chatDelay3);
    chatDelay = chatDelay3;
});