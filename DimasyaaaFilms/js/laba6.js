// Лабораторная работа 6
$(document).ready(function() {
    
    // ===ЗАДАНИЕ 1===
    $('#colorTable').hover(
        function() {
            $(this).toggleClass('alternate');
        },
        function() {
            $(this).toggleClass('alternate');
        }
    );

    // ===ЗАДАНИЕ 2===
    let selectedImage = null;
    
    // выбор постера
    $('.source-images img').click(function() {
        $('.source-images img').removeClass('selected');
        $(this).addClass('selected');
        selectedImage = $(this);
    });
    
    $('#executeAction').click(function() {
        if (!selectedImage) {
            alert('Пожалуйста, выберите постер фильма!');
            return;
        }
        
        const actionType = $('#actionType').val();
        const targets = $('input[name="target"]:checked');
        
        if (targets.length === 0) {
            alert('Пожалуйста, выберите хотя бы одну киноподборку!');
            return;
        }
        
        targets.each(function() {
            const targetId = $(this).val();
            const targetContent = $(`#${targetId} .target-content`);
            const movieTitle = selectedImage.data('title');
            
            switch(actionType) {
                case 'append':
                    selectedImage.clone().appendTo(targetContent);
                    break;
                case 'prepend':
                    selectedImage.clone().prependTo(targetContent);
                    break;
                case 'copy':
                    selectedImage.clone().appendTo(targetContent);
                    break;
            }
        });
        
        // обновляем обработчики для новых постеров
        $('.target-content img').click(function() {
            $(this).fadeOut(300, function() {
                $(this).remove();
            });
        });
    });
    
    // удаление постеров
    $('.target-content').on('click', 'img', function() {
        $(this).fadeOut(300, function() {
            $(this).remove();
        });
    });

    // ===ЗАДАНИЕ 3===
    let clickCount = 0;
    const $toggleImage = $('#toggleImage');
    const $clickCount = $('#clickCount');
    const $imageState = $('#imageState');
    
    $toggleImage.click(function() {
        clickCount++;
        $clickCount.text(clickCount);
        
        if (clickCount % 2 === 1) {
            // нечетный клик - сепия
            $(this).removeClass('hidden').addClass('semi-transparent');
            $imageState.text('Сепия');
        } else {
            // четный клик - обычный
            $(this).removeClass('semi-transparent hidden');
            $imageState.text('Обычный');
        }
    });
    
    // дабл клик - винтажный эффект
    $toggleImage.dblclick(function() {
        $(this).toggleClass('vintage');
        $imageState.text($(this).hasClass('vintage') ? 'Винтаж' : 'Обычный');
    });
    
    $('#resetToggle').click(function() {
        clickCount = 0;
        $clickCount.text('0');
        $toggleImage.removeClass('semi-transparent hidden vintage');
        $imageState.text('Обычный');
    });

    // ===ЗАДАНИЕ 4===
    // раскрытие/скрытие категорий
    $('.menu-category-title').click(function() {
        $(this).toggleClass('collapsed');
        $(this).next('.menu-items').slideToggle(300);
    });
    
    // скрываем все категории
    $('.menu-items').hide();
    $('.menu-category-title').addClass('collapsed');
    
    //дополнительные опции при выборе фильма
    $('input[name="mainFilm"]').change(function() {
        // скрываем все опции
        $('.item-options').removeClass('active').slideUp(200);
        
        // опции для выбранного фильма
        const filmType = $(this).val();
        $(`.item-options input[name^="${filmType}"]`).closest('.item-options')
            .addClass('active').slideDown(200);
    });
    
    // расчет рейтинга вечера
    function calculateTotal() {
        let total = 0;
        
        // фильмы
        $('input[name="mainFilm"]:checked').each(function() {
            total += parseFloat($(this).data('rating'));
        });
        
        //закуски
        $('input[name="snack"]:checked').each(function() {
            total += parseFloat($(this).data('rating'));
        });

        //атмофереа 
        $('input[name="atmosphere"]:checked').each(function() {
            total += parseFloat($(this).data('rating'));
        });
        
        //компания
        $('input[name="company"]:checked').each(function() {
            total += parseFloat($(this).data('rating'));
        });
        
        //максимальный рейтинг 10
        total = Math.min(total, 10);
        $('#totalAmount').text(total.toFixed(1));
    }
    
    $('input[type="radio"], input[type="checkbox"]').change(calculateTotal);
    
    // очистка подбора
    $('#clearOrder').click(function() {
        $('input[type="radio"], input[type="checkbox"]').prop('checked', false);
        $('.item-options').removeClass('active').slideUp(200);
        calculateTotal();
    });

    ////===ЗАДАНИЕ 5=====
    $('.list-title').click(function() {
        const $this = $(this);
        const $content = $('#' + $this.data('target'));
        
        $this.toggleClass('collapsed');
        $content.slideToggle(400);
        
        // анимация иконки
        $this.find('.toggle-icon').css('transform', 
            $this.hasClass('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)');
    });
    
    // буттон развернуть/свернуть все
    $('#toggleAll').click(function() {
        const allCollapsed = $('.list-title').length === $('.list-title.collapsed').length;
        
        if (allCollapsed) {
            // развернуть все
            $('.list-title').removeClass('collapsed');
            $('.list-content').slideDown(400);
            $('.toggle-icon').css('transform', 'rotate(0deg)');
        } else {
            // свернуть все
            $('.list-title').addClass('collapsed');
            $('.list-content').slideUp(400);
            $('.toggle-icon').css('transform', 'rotate(-90deg)');
        }
    });
    
    // сворачиваем все списки
    $('.list-title').addClass('collapsed');
    $('.list-content').hide();

    // ===ЗАДАНИЕ 6===
    let currentZoom = 1;
    const $zoomImage = $('#zoomImage');
    const $zoomValue = $('#zoomValue');
    
    // масштаьб
    $zoomImage.click(function() {
        if (currentZoom === 1) {
            currentZoom = 2;
            $(this).addClass('zoomed');
        } else {
            currentZoom = 1;
            $(this).removeClass('zoomed');
        }
        
        $(this).css('transform', `scale(${currentZoom})`);
        $zoomValue.text(Math.round(currentZoom * 100) + '%');
    });
    
    // кнопки управления масштабом
    $('#zoomIn').click(function() {
        currentZoom += 0.25;
        $zoomImage.css('transform', `scale(${currentZoom})`);
        $zoomValue.text(Math.round(currentZoom * 100) + '%');
        $zoomImage.addClass('zoomed');
    });
    
    $('#zoomOut').click(function() {
        currentZoom = Math.max(0.5, currentZoom - 0.25);
        $zoomImage.css('transform', `scale(${currentZoom})`);
        $zoomValue.text(Math.round(currentZoom * 100) + '%');
        
        if (currentZoom === 1) {
            $zoomImage.removeClass('zoomed');
        }
    });
    
    $('#resetZoom').click(function() {
        currentZoom = 1;
        $zoomImage.css('transform', 'scale(1)');
        $zoomValue.text('100%');
        $zoomImage.removeClass('zoomed');
    });
    
    // прокрутка к якорям
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 20
            }, 800);
        }
    });

    calculateTotal();
});