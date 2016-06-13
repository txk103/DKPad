$(document).ready(function(){

  //Check browser compatiblity
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    $.toaster('File handling supported', 'Pass', 'success');
  }
 else {
   $.toaster('File handling not supported', 'Fail', 'danger');
   return;
 }

 $('#save').click(function(){
     var source = createENSDFFile($('.dataRows > ol li').map(function(){return $(this).data('id');}).get());
     console.log(source);
 });

 $('#file').change(function(){

   var file = this.files[0];
   var reader = new FileReader();

   reader.onload = function(progressEvent){

       parseENSDFFile(this.result);

       var root=$('.dataRows > ol');
       var lastLevel1;

       $.each(ENSDF.data, function(key, data){

           var template = "<li data-id='" + key + "'><div><span class='disclose'><span></span></span><span class='cmds'></span><span class='data'></span></div></li>";

           if(data.meta.level==1){
                lastLevel1=root.append(template).children().last();
                buildRowInner(lastLevel1, data, 'display');
           }
           else{
                if($(lastLevel1).find('ol').length==0)lastLevel1.append('<ol></ol>');
                buildRowInner(lastLevel1.find('ol').append(template).children().last(), data, 'display');
           }
       });

       $('ol.sortable').nestedSortable({
 			forcePlaceholderSize: true,
 			handle: 'div',
 			helper:	'clone',
 			items: 'li',
 			opacity: .6,
 			placeholder: 'placeholder',
 			revert: 250,
 			tabSize: 25,
 			tolerance: 'pointer',
 			toleranceElement: '> div',
 			maxLevels: 2,
 			isTree: true,
 			expandOnHover: 700,
 			startCollapsed: true
 		});

        $('.disclose').on('click', function(event) {
			$(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
            event.stopPropagation();
		});

        //only bind for edit invoke, edit functions bound as required
        $('.cmds').on('click','.glyphicon-pencil', function(event) {
			var root = $(this).closest('li');
            buildRowInner(root, ENSDF.data[$(root).data('id')], 'edit');
            event.stopPropagation();
		});
  };

   reader.readAsText(file);
 });
});

function buildRowInner(el, data, mode){
    if(mode=='display'){
        $(el).find('.cmds').html("<span class='cmp glyphicon glyphicon-pencil' aria-hidden='true'></span>");

        var tmp="";
        $.each(data, function(key, data){
            if(key!='meta') tmp+="<span class='fl_" + key +"'>" + data +"</span>";
        });

        $(el).find('.data').html(tmp);
    }
    else{
        $(el).find('.cmds').html("<span class='cmp glyphicon glyphicon-ok' aria-hidden='true'></span><span class='cmp glyphicon glyphicon-remove' aria-hidden='true'></span><span class='cmp glyphicon glyphicon-trash' aria-hidden='true'></span><span class='cmp glyphicon glyphicon-plus' aria-hidden='true'></span>")
            .on('click','.glyphicon-ok', null, function(){
                var parent = $(this).closest('li')[0];
                var isValid=true;
                $(parent).find('div > .data > input').each(function(index,value){
                    if(!(new RegExp($(value).data('rule'))).test($(value).val())){
                        $(value).addClass('error');
                        isValid=false;
                        $.toaster('Cannot save, row contains errors', 'Error', 'danger');
                    }
                    else $(value).removeClass('error');
                });

                if(isValid){
                    $(parent).find('div > .data > input').each(function(index,value){
                        ENSDF.data[$(parent).data('id')][$(value).data('key')]=$(value).val();
                    });

                    buildRowInner(el, data, 'display');
                }

            })
            .one('click','.glyphicon-remove', null, function(){
                 buildRowInner(el, data, 'display');
            })
            .one('click','.glyphicon-plus', null, function(){
                //var key = addRow('');
                console.log('adding');
            })
            .one('click','.glyphicon-trash', null, function(){

                deleteRow($($(this).closest('li')[0]).data('id'));
                $(this).closest('li').remove();
            });

        //wire up edit events

        var tmp="";
        $.each(data, function(key, data){
            if(key!='meta')tmp+="<input type='text' class='fl_" + key +"' value='" + data +"' maxlength='" + ENSDF.fields[key].input + "' data-rule='" + ENSDF.fields[key].rule + "' data-key='" + key + "' />";
        });

        $(el).find('.data').html(tmp);
    }
}
