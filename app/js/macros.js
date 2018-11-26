var buttonsarray = []

function populateMacroButtons() {

  $("#macros").empty();
  for (i = 0; i < buttonsarray.length; i++) {
    var button = `
    <button id="macro` + i + `" onclick="sendGcode('` + buttonsarray[i].gcode + `');" class="shortcut outline rounded no-caption m-1 ` + buttonsarray[i].class + `">
        <span class="tag"><span onclick="edit(` + i + `, event);" id="edit` + i + `" class="fas fa-cogs"></span></span>
        <span class="caption">` + buttonsarray[i].title + `</span>
        <span class="` + buttonsarray[i].icon + ` icon"></span>
    </button>`
    $("#macros").append(button);
  }
  // append add button
  var button = `
  <button class="shortcut outline rounded no-caption m-1" onclick="edit(10, event)">
    <span class="caption">Add Macro</span>
    <span class="fas fa-plus icon"></span>
  </button>`
  $("#macros").append(button);
  localStorage.setItem('macroButtons', JSON.stringify(buttonsarray));
}

function edit(i, evt) {
  evt.preventDefault();
  evt.stopPropagation();
  console.log("Editing " + i)

  if (buttonsarray[i]) {
    var icon = buttonsarray[i].icon;
    var title = buttonsarray[i].title;
    var gcode = buttonsarray[i].gcode;
    var cls = buttonsarray[i].class;
  } else {
    var icon = "far fa-question-circle";
    var title = "";
    var gcode = "";
    var cls = "";
  }

  var macroTemplate = `<form>
      <div class="row mb-2">
          <label class="cell-sm-2">Icon</label>
          <div class="cell-sm-10">
              <input id="macroicon" type="text" value="` + icon + `">
          </div>
      </div>
      <div class="row mb-2">
          <label class="cell-sm-2">Label</label>
          <div class="cell-sm-10">
              <input id="macrotitle" type="text" value="` + title + `">
          </div>
      </div>
      <div class="row mb-2">
          <label class="cell-sm-2">GCODE</label>
          <div class="cell-sm-10">
              <input id="macrogcode" type="text" value="` + gcode + `">
          </div>
      </div>
      <div class="row mb-2">
          <label class="cell-sm-2">Color</label>
          <div class="cell-sm-10">
            <select data-role="select" id="macrocls">
              <option value="" selected>Default</option>
              <option value="primary">Blue</option>
              <option value="info">Light Blue</option>
              <option value="secondary">Blue-Gray</option>
              <option value="success">Green</option>
              <option value="alert">Red</option>
              <option value="warning">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
      </div>
      <input type="hidden" id="macroseq" value="` + i + `" />
  </form>`

  Metro.dialog.create({
    title: "Edit Macro",
    content: macroTemplate,
    actions: [{
        caption: "Cancel",
        cls: "js-dialog-close",
        onclick: function() {
          //
        }
      },
      {
        caption: "Delete Macro",
        cls: "js-dialog-close alert",
        onclick: function() {
          buttonsarray.splice(i, 1);
          populateMacroButtons();
        }
      },
      {
        caption: "Apply",
        cls: "js-dialog-close success",
        onclick: function() {
          var seq = $('#macroseq').val();
          if (buttonsarray[seq]) {
            buttonsarray[seq].icon = $('#macroicon').val();
            buttonsarray[seq].title = $('#macrotitle').val();
            buttonsarray[seq].gcode = $('#macrogcode').val();
            buttonsarray[seq].class = $('#macrocls').val();
            populateMacroButtons();
          } else {
            buttonsarray.push({
              title: $('#macrotitle').val(),
              icon: $('#macroicon').val(),
              gcode: $('#macrogcode').val(),
              class: $('#macrocls').val()
            })
            populateMacroButtons();
          }
        }
      }
    ]
  });

  var options = {
    placement: 'bottom',
    collision: 'none',
    animation: true,
    hideOnSelect: true,
  };

  // fa iconpicker https://github.com/farbelous/fontawesome-iconpicker
  $('#macroicon').iconpicker(options);
  $("#macrocls").val(cls).trigger("change");

}

function run(i, evt) {
  evt.preventDefault();
  evt.stopPropagation();
  console.log("Run " + i)
}


// run it to begin
if (localStorage.getItem('macroButtons')) {
  buttonsarray = JSON.parse(localStorage.getItem('macroButtons'));
}

populateMacroButtons()