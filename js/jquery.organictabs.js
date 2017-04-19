/*jshint browser:true */
/*global define, jQuery, window */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.organicTabs = function(el, options) {
    
        var base = this;
        base.$el = $(el);
        base.$nav = base.$el.find(".nav");

        base.init = function() {
        
            base.options = $.extend({},$.organicTabs.defaultOptions, options);
            
            // Accessible hiding fix
            $(".hide").css({
                "position": "relative",
                "top": 0,
                "left": 0,
                "display": "none"
            }); 
            
            base.$nav.on("click", "li > a", function() {

                // Figure out current list via CSS class
                var curList = base.$el.find("a.current").attr("href").substring(1),
                
                // List moving to
                    $newList = $(this),
                    
                // Figure out ID of new list
                    listID = $newList.attr("href").substring(1),
                
                // Set outer wrapper height to (static) height of current inner list
                    $allListWrap = base.$el.find(".list-wrap"),
                    curListHeight = $allListWrap.height();
                    $allListWrap.height(curListHeight);

                if ((listID != curList) && ( base.$el.find(":animated").length == 0)) {
                                            
                    // Fade out current list
                    base.$el.find("#"+curList).fadeOut(base.options.speed, function() {
                        
                        // Fade in new list on callback
                        base.$el.find("#"+listID).fadeIn(base.options.speed);
                        
                        // Adjust outer wrapper to fit new list snuggly
                        var newHeight = base.$el.find("#"+listID).height();
                        $allListWrap.animate({
                            height: newHeight
                        });
                        
                        // Remove highlighting - Add to just-clicked tab
                        base.$el.find(".nav li a").removeClass("current");
                        $newList.addClass("current");
                            
                    });

                    // Update URL bar, retain state
                    window.history.pushState({ 
                        'organictabsState': listID 
                        }, 
                    window.document.title, window.location.pathname + "#!" + listID);
                }   
                
                // Don't behave like a regular link
                // Stop propegation and bubbling
                return false;
            });
            
        };
        base.init();

        // check for window.state, if exists then activate
                
        if(window.history.state && window.history.state.length !==0){
            if("organictabsState" in window.history.state){ // check for the organictabsState key
                // pull back in all of the var declarations so that they're accessible at start
                curList = base.$el.find("a.current").attr("href").substring(1);
                stateID = window.history.state.organictabsState;
                $allListWrap = base.$el.find(".list-wrap"),
                curListHeight = $allListWrap.height();
                $allListWrap.height(curListHeight);

                if (window.history.state.organictabsState != curList) {

                                            
                    // Fade out current list
                    base.$el.find("#"+curList).fadeOut("fast", function() {
                        
                        // Fade in new list on callback
                        base.$el.find("#"+stateID).fadeIn("fast");
                        
                        // Adjust outer wrapper to fit new list snuggly
                        var newHeight = base.$el.find("#"+stateID).height();
                        $allListWrap.animate({
                            height: newHeight
                        });
                        
                        // Cycle through nav options, add class=current to organictabsState and remove from others
                        base.$el.find(".nav li a").each(function(){
                            $(this).attr("href") === "#" + stateID ? $(this).addClass("current") : $(this).removeClass("current");
                        });
                            
                    });
                }
            }
        }





    };
    
    $.organicTabs.defaultOptions = {
        "speed": 300
    };
    
    $.fn.organicTabs = function(options) {
        return this.each(function() {
            (new $.organicTabs(this, options));
        });
    };

}));
