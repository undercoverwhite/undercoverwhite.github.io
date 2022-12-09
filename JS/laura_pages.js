$(function() {
    setSlider();
});

function setSlider() {
    $('ul.slider').each(function() {
        var ul = $(this);
        var lis = ul.children();

        for (let i = 0; i < lis.length; ++i) {
            let prev = lis.eq(i).find('.slider__prev').eq(0);
            let next = lis.eq(i).find('.slider__next').eq(0);

            if (lis.length == 1) {
                prev.remove();
                next.remove();
            } else {
                if (i == 0)
                prev.remove();
                else if (i == (lis.length - 1))
                    next.remove();

                if (prev != undefined) {
                    log(prev);
                    prev.click(function() {
                        goTo(lis, lis.eq(i - 1));
                    });
                }

                if (next != undefined) {
                    log(next);
                    next.click(function() {
                        goTo(lis, lis.eq(i + 1));
                    });

                }
            }
            if (i == 0) lis.eq(i).addClass('displayed');
        }
    });
}

function goTo(li, slideTo) {
    li.removeClass('displayed');
    slideTo.addClass('displayed');
}