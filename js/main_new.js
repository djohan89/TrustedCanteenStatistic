/* ===== Đầu: Phần chức năng kiểm tra loại file ===== */
    $('#fileup').change(function(){
    //here we take the file extension and set an array of valid extensions
        var res=$('#fileup').val();
        var arr = res.split("\\");
        var filename=arr.slice(-1)[0];
        filextension=filename.split(".");
        filext="."+filextension.slice(-1)[0];
        valid=[".xls",".xlsx"];
    //if file is not valid we show the error icon, the red alert, and hide the submit button
        if (valid.indexOf(filext.toLowerCase())==-1){
            $( ".imgupload" ).hide("slow");
            $( ".imgupload.ok" ).hide("slow");
            $( ".imgupload.stop" ).show("slow");
          
            $('#namefile').css({"color":"red","font-weight":700});
            $('#namefile').html("File "+filename+" is not  pic!");
            
            $( "#submitbtn" ).hide();
            $( "#fakebtn" ).show();
        }else{
            //if file is valid we show the green alert and show the valid submit
            $( ".imgupload" ).hide("slow");
            $( ".imgupload.stop" ).hide("slow");
            $( ".imgupload.ok" ).show("slow");
          
            $('#namefile').css({"color":"green","font-weight":700});
            $('#namefile').html(filename);
          
            $( "#submitbtn" ).show();
            $( "#fakebtn" ).hide();
        }
    });
/* ===== Cuối: Phần chức năng kiểm tra loại file ===== */



/* ===== Đầu: Phần chức năng đọc file excel ===== */
    var selectedFile;
    document
        .getElementById("fileup")
        .addEventListener("change", function(event) {
            selectedFile = event.target.files[0];
        });
    document
        .getElementById("submitbtn")
        .addEventListener("click", function() {
            if (selectedFile) {
                console.log("Hello Hi Bông Dua Canh thiu không ai múc!!!");
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    var data = event.target.result;

                    var workbook = XLSX.read(data, {
                        type: "binary"
                    });
                    workbook.SheetNames.forEach(sheet => {
                        let rowObject = XLSX.utils.sheet_to_row_object_array(
                            workbook.Sheets[sheet]
                        );
                        let jsonObject = JSON.stringify(rowObject);
                        // document.getElementById("jsonData").innerHTML = jsonObject;
                        
                        // console đoạn json dưới dạng string
                        // console.log(jsonObject);

                        // console đoạn json dưới dạng đối tượng
                        // console.log(rowObject, typeof(rowObject), rowObject.Name);

                        /*view_json_1(rowObject);*/
                        view_json_employee(rowObject); // Gọi và đẩy dữ liệu đến function view_json_employee
                    });
                };
                fileReader.readAsBinaryString(selectedFile);
            }
        });

    function view_json_employee(rowObject) {

        var obj_check_null = [];
        var obj_group = []; // Mảng rỗng để đẩy dữ liệu vào
        var dem = 0;

        /* Lọc dữ liệu để đưa vào mảng json xử lý */
        for(var x in rowObject) {

            var str = rowObject[x]['Date & Time'];
            var sub_str = str.substring(11, 13); // 
            var check_date = parseInt(sub_str);

            // Chỉ lấy những bản ghi có các trường không bỏ trống
            if (rowObject[x]['Name'] && rowObject[x]['Company'] && rowObject[x]['Card No']) {
                // Chỉ lấy những bản ghi trong khoảng từ 11h đến 15h
                if (check_date >= 11 && check_date <= 15) {
                    // console.log(rowObject[x], "hello xxx");
                    obj_check_null.push(rowObject[x]);
                    dem++;
                }
            }
        }
        console.log(dem, obj_check_null); // Mảng json lấy được



        // Thêm dữ liệu vào datatable
        // table.rows.add(obj_check_null); // Add new data
        // table.columns.adjust().draw(); // Redraw the DataTable


        // Nhóm dữ liệu của mảng json theo trường "Company"
        var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        var groubedByTeam = groupBy(obj_check_null, 'Company');

        console.log("Phân chia theo mục Company:");
        console.log("");
        console.log(groubedByTeam);
        console.log(typeof(groubedByTeam));


    /*Sau khi lấy được mảng json đã gộp dữ liệu theo nhóm (Company). 
        Đến chức năng sắp xếp mảng json đó (trường hợp có keys) theo trường "Company" 
        theo bảng chữ cái*/
        const ordered = Object.keys(groubedByTeam).sort().reduce(
            (obj, key) => { 
                obj[key] = groubedByTeam[key]; 
                return obj;
            }, 
            {}
        );
        console.log("ordered", JSON.stringify(ordered));



        // Vòng lặp đọc mảng json khi có key
        var data_detail_staff = "";
        var data_show = "";
        var data_show_child =   '<li>' +
                                    '<table class="table">';
        var group_name = "";

        // for(var k in groubedByTeam) {
        for(var k in ordered) {

            // Nhóm dữ liệu của từng mảng theo trường "Name"
            group_name = ordered[k];
            var groupByName = function(xs, key) {
                return xs.reduce(function(rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };
            var result_group_name = groupByName(group_name, 'Name');
            console.log("");
            console.log("Nhóm theo tên:");
            console.log(group_name, result_group_name);

            // Phần hiển thị thông tin chi tiết về danh sách nhân viên quẹt thẻ của mỗi phòng/ban
            // for(var x in ordered[k]) {
            for(var x in result_group_name) {
                // console.log("---"+x, ordered[k][x]);

                for(var n in result_group_name[x]) {
                    data_detail_staff = result_group_name[x][n]["Card No"];
                }

                data_show_child +=  '<tr>' +
                                        '<td>' +
                                            + data_detail_staff +
                                        '</td>' +
                                        '<td>' +
                                            x +
                                        '</td>' +
                                        '<td>' +
                                            '(' + result_group_name[x].length + ')' +
                                        '</td>' +
                                    '</tr>';

            }
            data_show_child +=      '</table>' +
                                '</li>';

            /* Phần hiển thị danh sách phòng/ban có kèm chi tiết lấy từ vòng lặp trên */
            data_show += '<li>' +
                            '<a href="javascript:void(0)" class="drop_active">' +
                                k +
                                '<i class="icon-menu fas fa-chevron-down"></i> ' + 
                                '(' + ordered[k].length + ')' +
                            '</a>' +
                            '<ul class="sub-menu">' +
                                data_show_child +
                            '</ul>' +
                        '</li>';


            const key = 'Name';
            var arrayUniqueByKey = [...new Map(ordered[k].map(item =>
                [item[key], item])).values()];

            console.log("key nè: "+k, arrayUniqueByKey);
            obj_group.push(arrayUniqueByKey);

            data_show_child =   '<li>' +
                                    '<table class="table">';
        }
        document.getElementById("div_data_show").innerHTML = data_show;
        console.log("Đã chèn thành công!!!");
        // console.log("Dữ liệu chính:", obj_group);

        // Thay thế dữ liệu mới lấy được (XL_row_object) truyền vào datatable (báo cáo 1)
        /*datatable.clear().draw();
        datatable.rows.add(obj); // Add new data
        datatable.columns.adjust().draw(); // Redraw the DataTable*/

        $('.dropdown-menu-1 .drop_active').click(function () {
            // console.log("ABC");
            $(this).parent('li').children('.sub-menu').slideToggle();
            $(this).find("i").toggleClass('fa-chevron-down fa-chevron-right');
        });
        
    }
/* ===== Cuối: Phần chức năng đọc file excel ===== */