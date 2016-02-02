var grades = ["F ","D3","D2","D1","C3","C2","C1","B3","B2","B1","A2","A1"];
var higher = [0,45,50,55,60,65,70,75,80,85,90,100];
var lower = [0,5,10,15,20,25,30,35,40,45,50,60];
var foundation = [0,0,0,0,0,0,0,0,5,10,15,20];
jQuery(document).ready( function() {
	$('.glyphicon').tooltip();
	$('.gradeSelect,.levelSelect').on('change', function() {
		var id = $(this).attr('id');
		var num = id.substring(id.length - 1);
		$('label[for="gradeSelect'+num+'"]').hide();
	});	
	$('#submitGrades').click(function() {
		var results = [];
		var points = 0;
		var error = false;
		//do more validation
		var selected = $('.levelSelect').find(':selected');
		var gradesInput = $('.gradeSelect').find(':selected');
		//check compulsory subjects are set
		for(var i=0;i<3;i++){
			if(selected[i].text == "Level" || gradesInput[i].text == "Subject"){
				$('#pointsResult').parent().removeClass('alert-success');
				$('#pointsResult').parent().addClass('alert-danger');	
				$('#pointsResult').html('<strong>Error:</strong> You must enter the 3 compulsory subjects and a total of 6 subjects. <br /> If you have an exemption in Irish set that as the level. <br /> You can read more information <a href="about.html" class="alert-link">here</a>.');
				return;
			}
		}
		//check if failed a compulsory subject
		for(var i=0;i<3;i++){
			if(selected[i].text != "Exemption" && gradesInput[i].text.substring(0,1) == "F"){
				$('#pointsResult').parent().removeClass('alert-success');
				$('#pointsResult').parent().addClass('alert-danger');	
				$('#pointsResult').html('<strong>Error:</strong> You have failed a compulsory subject.<br /> You can read more information <a href="about.html" class="alert-link">here</a>.');
				return;
			}

		}
		//Add the grade. Show what each result was worth
		$(gradesInput).each(function(i, obj){
			var input = gradesInput[i].text.substring(0, 2);
			var levelInput = selected[i].text;
			var id = $(gradesInput[i]).parent().attr('id');
			var res;
			if(input !== "Gr" && levelInput !== "Level"){
				if(selected[i].text == "Higher" || selected[i].text == "Higher (Pre 2013)"){
					res = higher[jQuery.inArray(input, grades)];
					//25 bonus higher level maths points
					if(selected[i].id == "mathsLevelH"){
						res += 25;
					}
				}
				else if(selected[i].text == "Ordinary"){
					res = lower[jQuery.inArray(input, grades)];
				}
				else if(selected[i].text == "Foundation"){
					res = foundation[jQuery.inArray(input, grades)];
				}
				results.push(res);
				$('label[for="'+id+'"]').show();
				$('label[for="'+id+'"]').text(res);
			}
		});
		//LCVP
		if($('select#lcvp').find(':selected').text() == "Common"){
				var grade = $('select#lcvpGrade').find(':selected').text();
				var resl;
				if(grade == "Merit (FM)"){
					resl = 50;
				}
				else if(grade =="Distinction (GD)"){
					resl=70;
				}
				else if(grade == "Pass (PP)"){
					resl=30;
				}
				results.push(resl);
				$('label[for="lcvpGrade"]').show();
				$('label[for="lcvpGrade"]').text(resl);
		}
		//check if 6 subjects were
		if(results.length <6){
			$('#pointsResult').parent().removeClass('alert-success');
			$('#pointsResult').parent().addClass('alert-danger');	
			$('#pointsResult').html('<strong>Error:</strong> You must enter at least 6 subjects. <br /> You can read more information <a href="about.html" class="alert-link">here</a>.');
			error = true;
			return;
		}

		if(!error){
			//sort the results so we can obtain best 6 subjects
			results.sort(function(a,b){
        		return b-a;
    		});
			//add the highest 6 results
			for(var i=0;i<6;i++){
				points += results[i];
			}
			$('#pointsResult').parent().removeClass('alert-danger');
			$('#pointsResult').parent().addClass('alert-success');		
			$('#pointsResult').html('Points = <strong>'+points+'</strong>');
		}
		
	});
});