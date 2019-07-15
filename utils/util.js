const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//提示窗口(标题，内容, (错误提示=0 红色，普通提示=1，蓝色) )
function TipModel(Title, content, level = 1) {
  var mTitle = Title;
  var mContent = content;
  var mColor

  if (level == 0) {
    mColor = '#F21C2E'
  } else {
    mColor = '#075FA9'
  }
  wx.showModal({
    title: mTitle,
    content: mContent,
    confirmColor: mColor,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      }
    }
  });
}

//列表初始化（未选中）
function tableListInit(data){
  for (var table of data) {
    table['selected'] = false;
  }
}

module.exports = {
  formatTime: formatTime,
  TipModel: TipModel,
  tableListInit: tableListInit,
}
