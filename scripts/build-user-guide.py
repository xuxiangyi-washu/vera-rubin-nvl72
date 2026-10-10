from pathlib import Path
import json, math, hashlib, html, shutil
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak, Table, TableStyle, Flowable, KeepTogether
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/NVL72-架构探索器-使用说明.pdf'
SITE='https://vera-rubin-nvl72.xuxiangyi666.workers.dev/'
W,H=A4
CW=W-88
pdfmetrics.registerFont(TTFont('GuideCN','/System/Library/Fonts/Supplemental/Arial Unicode.ttf'))
pdfmetrics.registerFont(TTFont('GuideBold','/System/Library/Fonts/STHeiti Medium.ttc',subfontIndex=0))
pdfmetrics.registerFontFamily('GuideCN',normal='GuideCN',bold='GuideBold',italic='GuideCN',boldItalic='GuideBold')
GREEN=colors.HexColor('#385e27'); INK=colors.HexColor('#17261c'); MUTED=colors.HexColor('#61705e')
styles={
 'body':ParagraphStyle('Body',fontName='GuideCN',fontSize=11,leading=18,spaceAfter=9,textColor=INK,wordWrap='CJK'),
 'small':ParagraphStyle('Small',fontName='GuideCN',fontSize=9,leading=14,spaceAfter=7,textColor=MUTED,wordWrap='CJK'),
 'chapter':ParagraphStyle('Chapter',fontName='GuideBold',fontSize=23,leading=31,spaceAfter=18,textColor=colors.black,wordWrap='CJK'),
 'h2':ParagraphStyle('Section',fontName='GuideBold',fontSize=14,leading=21,spaceBefore=11,spaceAfter=8,textColor=colors.black,wordWrap='CJK'),
 'title':ParagraphStyle('Title',fontName='GuideBold',fontSize=36,leading=48,spaceAfter=10,textColor=colors.black),
 'subtitle':ParagraphStyle('Subtitle',fontName='GuideCN',fontSize=15,leading=24,spaceAfter=15,textColor=INK,wordWrap='CJK'),
 'tag':ParagraphStyle('Tag',fontName='GuideCN',fontSize=10,leading=16,spaceAfter=10,textColor=GREEN),
 'cell':ParagraphStyle('Cell',fontName='GuideCN',fontSize=9.5,leading=14.5,textColor=INK,wordWrap='CJK'),
 'headcell':ParagraphStyle('HeadCell',fontName='GuideBold',fontSize=9.5,leading=14,textColor=colors.white,wordWrap='CJK'),
 'source':ParagraphStyle('Source',fontName='GuideCN',fontSize=9.2,leading=14,spaceAfter=8,textColor=INK,wordWrap='CJK'),
}
sources=json.loads((ROOT/'src/data/sources.json').read_text())
source_map={s['id']:s for s in sources}

def para(text,style='body'):
 return Paragraph(text,styles[style])
def refs(*ids):
 parts=[]
 for id in ids:
  source=source_map[id]
  if source.get('url'):parts.append(f'<link href="{html.escape(source["url"],quote=True)}" color="#385e27">[{id}]</link>')
  else:parts.append(f'[{id}]')
 return ' '.join(parts)
def p(text,*ids):return para(text+(' '+refs(*ids) if ids else ''))
def h(text):return para(text,'h2')
def small(text,*ids):return para(text+(' '+refs(*ids) if ids else ''),'small')
def tab(headers,rows,widths=None):
 values=[[Paragraph(html.escape(str(v)),styles['headcell']) for v in headers]]+[[Paragraph(str(v),styles['cell']) for v in row] for row in rows]
 table=Table(values,colWidths=widths or [CW/len(headers)]*len(headers),repeatRows=1,hAlign='LEFT')
 table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('GRID',(0,0),(-1,-1),.45,colors.HexColor('#d4ddcf')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f3f6ef')])]))
 table.spaceAfter=12
 return table

class Diagram(Flowable):
 def __init__(self,kind,height=210):
  Flowable.__init__(self);self.kind=kind;self.width=CW;self.height=height;self.spaceAfter=14
 def draw(self):
  c=self.canv;sy=self.height/240;c.saveState();c.scale(CW/500,sy)
  def text(t,x,y,w=100,size=10,color='#17261c',center=True):
   st=ParagraphStyle('D',fontName='GuideCN',fontSize=size,leading=size*1.4,textColor=colors.HexColor(color),alignment=TA_CENTER if center else TA_LEFT,wordWrap='CJK')
   q=Paragraph(t,st);_,hh=q.wrap(w,200);q.drawOn(c,x,y-hh)
  def box(t,x,y,w=130,hh=48,color='#eaf2e3',stroke='#648a49'):
   c.setFillColor(colors.HexColor(color));c.setStrokeColor(colors.HexColor(stroke));c.setLineWidth(.8);c.roundRect(x,y,w,hh,5,fill=1,stroke=1)
   if t:
    size=8.6 if hh<28 else 10
    st=ParagraphStyle('Box',fontName='GuideCN',fontSize=size,leading=size*1.35,textColor=INK,alignment=TA_CENTER,wordWrap='CJK')
    q=Paragraph(t,st);_,qh=q.wrap(w-10,200);q.drawOn(c,x+5,y+(hh-qh)/2)
  def arrow(x1,y1,x2,y2,color='#557c3e'):
   c.setStrokeColor(colors.HexColor(color));c.setFillColor(colors.HexColor(color));c.setLineWidth(1.4);c.line(x1,y1,x2,y2);a=math.atan2(y2-y1,x2-x1);path=c.beginPath();path.moveTo(x2,y2);path.lineTo(x2-6*math.cos(a-.45),y2-6*math.sin(a-.45));path.lineTo(x2-6*math.cos(a+.45),y2-6*math.sin(a+.45));path.close();c.drawPath(path,fill=1,stroke=0)
  if self.kind=='rack':
   c.setStrokeColor(colors.HexColor('#314932'));c.setFillColor(colors.HexColor('#eef2e9'));c.roundRect(25,8,200,224,7,fill=1)
   parts=[('2 × 管理 ToR',21,'#e0e7ea'),('2 × 电源层',26,'#f0e6cc'),('10 × 计算托盘',43,'#dceccf'),('9 × NVLink交换托盘',37,'#efdde2'),('8 × 计算托盘',37,'#dceccf'),('2 × 电源层',26,'#f0e6cc')];y=225
   for label,hh,color in parts:y-=hh;box(label,35,y,180,hh-3,color)
   box('前部：可维护托盘<br/>72 GPU / 36 CPU',280,169,205,57)
   box('后部：NVLink spine<br/>4 cartridge / 约5,000铜缆',280,89,205,61,'#f1dfe5','#b16e80')
   box('busbar / 液冷 manifold<br/>后部盲插接入',280,12,205,58,'#dff1ec','#58978a');arrow(226,118,278,118,'#b36c7c')
  elif self.kind=='tray':
   box('后部：NVLink / 电力 / 液冷盲插',15,197,470,35,'#efdee4','#b16f81')
   for i in range(2):
    x=20+i*245;box('',x,83,225,98);text('Superchip '+str(i+1),x+8,178,208,10)
    box('1 × Vera CPU',x+62,129,100,31,'#dbeeea','#6c9d91')
    box('Rubin GPU',x+8,92,95,29);box('Rubin GPU',x+122,92,95,29);arrow(x+110,129,x+58,123,'#bb7180');arrow(x+115,129,x+168,123,'#bb7180')
   box('BlueField-4 / Astra',171,36,160,34)
   for i in range(8):box('CX9',20+i*60,0,52,24,'#ddeaf6','#688daa');arrow(250,35,46+i*60,25)
  elif self.kind=='nvlink':
   for label,x,color in [('源GPU',10,'#e4f0d8'),('spine',135,'#efdde3'),('交换ASIC',260,'#efdde3'),('目标GPU',385,'#e4f0d8')]:box(label,x,131,106,60,color)
   for x in [116,241,366]:arrow(x,161,x+17,161,'#b46b7d')
   text('9 个交换托盘 × 4 ASIC = 36 ASIC',55,100,390,12)
   text('全互联表示逻辑可达；一次传输不依次经过36颗ASIC。<br/>物理lane、逐端口映射与交换密钥角色保留待核实。',45,60,410,10)
  elif self.kind=='network':
   rows=[('Scale-Up','GPU / CPU','NVLink / C2C','机架计算域','#b77080'),('Scale-Out','ConnectX-9','外部计算交换网','其他机架','#5a8db8'),('Scale-In','BlueField / DOCA','访问与存储网络','数据 / 基础设施','#539b86'),('带外','BMC / 管理入口','管理 ToR','配置 / 监控','#86929b')]
   for i,(label,a,b,d,col) in enumerate(rows):
    y=190-i*57;text(label,1,y+34,85,11,color=col);box(a,90,y,115,45,'#f1f5ed',col);box(b,230,y,127,45,'#f1f5ed',col);box(d,382,y,113,45,'#f1f5ed',col);arrow(206,y+22,227,y+22,col);arrow(359,y+22,379,y+22,col)
  elif self.kind=='astra':
   box('租户OS / 工作负载<br/>CPU + GPU',8,71,132,91,'#eee6f4','#9a80ad');box('带外管理侧',225,192,164,35);box('BlueField-4<br/>Astra / DOCA',225,116,164,57);arrow(307,191,307,174)
   text('专用控制连接',243,99,136,10)
   for i in range(8):box('CX9 '+str(i+1),151+i*43,25,40,35,'#deebf6','#638bb0');arrow(307,115,171+i*43,61)
   arrow(141,89,160,61,'#5d92bd');text('蓝色为租户数据面；绿色为专用管理连接。',15,17,470,9)
  elif self.kind=='cc':
   c.setFillColor(colors.HexColor('#f0eaf5'));c.setStrokeColor(colors.HexColor('#a98abc'));c.roundRect(5,94,490,131,8,fill=1)
   text('工作负载保护域：不同端点与密钥域',30,213,440,11)
   box('Vera Realm<br/>每VM密钥',20,115,126,66,'#e8dcf0','#a180b6');box('Rubin GPU TEE',222,115,122,66);box('另一GPU TEE',382,115,100,66);arrow(149,148,219,148,'#b96e83');arrow(346,148,379,148,'#b96e83')
   text('C2C加密',148,141,73,8);text('NVLink',343,142,40,7.5)
   box('SPDM / TDISP / IDE<br/>可信设备 I/O',90,4,184,62,'#e7e0f0','#9a7eb1');box('外部网络 / 存储<br/>传输与落盘独立保护',330,4,163,62,'#e2edf6','#6d96b7');arrow(84,113,145,66,'#9274a8');arrow(276,34,328,34,'#6d96b7')
  elif self.kind=='sentry':
   box('Agent / OpenShell<br/>软件运行时与沙箱',7,113,140,82,'#e1edf6','#6e98b8');box('BlueField-4<br/>DOCA / Sentry',182,113,147,82);box('模型服务',365,113,130,82,'#e1edf6','#6e98b8');arrow(149,154,180,154,'#6992b3');arrow(331,154,363,154,'#6992b3');box('身份 / 策略 / 活动证据<br/>关联判定与独立执行',167,15,178,65,'#eee5f4','#9b80ae');arrow(231,113,231,80,'#9b80ae');arrow(280,81,280,111);text('指定参考拓扑中的必要模型路径；不可绕过性需单独验证。',10,226,485,10)
  elif self.kind=='platform':
   box('应用层 APPLICATION<br/>模型 / harness / 工具 / 数据 / 脚本',20,167,460,65,'#e0edf7','#6b95b8');box('运行时 RUNTIME / OpenShell<br/>策略 / 沙箱 / 监控 / 治理',20,85,460,64,'#ebe2f1','#9a7eb2');box('基础设施 INFRASTRUCTURE<br/>计算与数据资源；支持环境中可选Sentry硬件层',20,3,460,64);arrow(250,166,250,151,'#9b7db0');arrow(250,83,250,69)
  elif self.kind=='ranks':
   for i in range(3):
    x=9+i*165;box('',x,98,155,122,'#eee6f4','#9b84ad');text('OS域 '+chr(65+i)+' / 示例Realm',x+5,212,145,9.5)
    for j in range(2):box('rank '+str(i*2+j)+'<br/>GPU '+str(i*2+j+1).zfill(2),x+8+j*74,113,65,66)
   box('NVLink交换fabric：逻辑汇聚，不是物理环',10,25,483,48,'#efdde4','#b27685')
   for i in range(6):arrow(41+i*82,98,41+i*82,75,'#b27685')
  elif self.kind=='ring':
   pts=[(250+155*math.cos(i*math.pi/3),121+83*math.sin(i*math.pi/3)) for i in range(6)]
   for i,(x,y) in enumerate(pts):
    nx,ny=pts[(i+1)%6];dx,dy=nx-x,ny-y;l=math.hypot(dx,dy);arrow(x+dx/l*34,y+dy/l*20,nx-dx/l*35,ny-dy/l*23,'#b47987')
   for i,(x,y) in enumerate(pts):box('rank '+str(i),x-35,y-19,70,38)
   text('Reduce-Scatter 5轮<br/>+ AllGather 5轮',172,146,156,12)
   text('6 rank教学逻辑环；真实NCCL可选择其他算法。',20,14,460,10)
  elif self.kind=='crypto':
   box('源端明文<br/>密钥 / nonce / AAD',8,132,132,76)
   box('认证加密输出<br/>密文 + 标签',188,132,132,76,'#eee5f5','#9a7fb0')
   box('接收端验证<br/>通过后交付明文',368,132,124,76)
   arrow(142,169,185,169,'#ae7188');arrow(322,169,366,169,'#ae7188')
   box('正常包<br/>认证通过',12,35,140,64)
   box('密文或AAD篡改<br/>认证失败',180,35,140,64,'#f3e1df','#b97c72')
   box('合法旧包<br/>额外检查重放',346,35,144,64,'#f2ead5','#ad985c')
   text('通用AEAD示意，不代表NVLink 6算法、报文或端点实现。',15,16,470,9)
  elif self.kind=='ui':
   c.setStrokeColor(colors.HexColor('#afbea4'));c.setFillColor(colors.HexColor('#f5f7f1'));c.rect(2,3,496,229,fill=1)
   box('左侧导航<br/>7个主视图<br/><br/>搜索与模块目录',8,10,95,214)
   box('顶部：来源 / PDF / JSON导出',110,199,379,29)
   box('3D画布 / 官方图<br/>旋转、缩放、拾取<br/>图层与流量动画',110,50,252,141,'#e5ece1','#849e76')
   box('模块详情<br/>规格、连接<br/>来源、边界',369,50,120,141,'#f0e9dd','#aa976e')
   box('图文详解 / 逐步演示 / 数值表',110,10,379,33,'#e6edf3','#7697ac')
  c.restoreState()

class Screenshot(Flowable):
 # 截图保持原始像素；仅在文档排版时裁切浏览器边框和无关区域。
 def __init__(self,name,crop,max_height=465):
  Flowable.__init__(self)
  self.path=ROOT/'docs/screenshots'/f'{name}.png'
  self.image=ImageReader(str(self.path));self.iw,self.ih=self.image.getSize()
  self.crop=crop;cw,ch=crop[2]-crop[0],crop[3]-crop[1]
  self.scale=min(CW/cw,max_height/ch);self.width=CW;self.height=ch*self.scale;self.spaceAfter=10
 def draw(self):
  c=self.canv;x0,y0,x1,y1=self.crop;cw=x1-x0;ch=y1-y0;sc=self.scale
  c.saveState();c.translate((CW-cw*sc)/2,0)
  path=c.beginPath();path.rect(0,0,cw*sc,ch*sc);c.clipPath(path,stroke=0,fill=0)
  c.drawImage(self.image,-x0*sc,-(self.ih-y1)*sc,width=self.iw*sc,height=self.ih*sc,mask='auto')
  c.restoreState()

class GuideDoc(BaseDocTemplate):
 def __init__(self,path):
  BaseDocTemplate.__init__(self,str(path),pagesize=A4,leftMargin=44,rightMargin=44,topMargin=56,bottomMargin=49,title='Vera Rubin NVL72 架构探索器使用说明',author='NVL72 架构探索器项目',subject='公开3D网站操作、架构图文与机密计算边界',allowSplitting=1)
  frame=Frame(44,49,CW,H-105,id='main',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)
  self.addPageTemplates(PageTemplate(id='Guide',frames=[frame],onPage=self.decorate))
 def decorate(self,c,doc):
  c.saveState()
  if doc.page>1:
   c.setFont('GuideCN',8.5);c.setFillColor(MUTED);c.drawString(44,H-31,'VERA RUBIN NVL72  /  使用说明');c.drawRightString(W-44,H-31,'2026.10.10 公开资料版本')
   c.setStrokeColor(colors.HexColor('#d6dfd0'));c.line(44,H-39,W-44,H-39)
  c.setFont('GuideCN',8.5);c.setFillColor(MUTED);c.drawString(44,27,'架构与流程教学演示 · 非实机性能与安全认证');c.drawRightString(W-44,27,f'{doc.page:02d}')
  c.restoreState()
 def afterFlowable(self,item):
  if isinstance(item,Paragraph) and item.style.name=='Chapter':
   text=item.getPlainText();
   if not text[:2].isdigit():return
   key='chapter-'+hashlib.sha1(text.encode()).hexdigest()[:10];self.canv.bookmarkPage(key);self.canv.addOutlineEntry(text,key,0,False);self.notify('TOCEntry',(0,text,self.page,key))

story=[]
def add(*items):story.extend(items)
def chapter(title,*items):
 add(PageBreak(),para(title,'chapter'),*items)

add(Spacer(1,24),para('交互式架构研究 / 操作与解读手册','tag'),para('Vera Rubin NVL72','title'),para('架构探索器使用说明','chapter'),para('从机柜与交换网络，到基础设施信任边界和分布式推理动画。','subtitle'),Diagram('rack',270),Spacer(1,15),p('本手册对应公开网站的7个主视图、13个图文专题和NCCL教学动画，面向架构学习、团队交流与方案讨论。'),para(f'<link href="{SITE}" color="#385e27">{SITE}</link>','small'))
code=qr.QrCodeWidget(SITE);bounds=code.getBounds();size=70;d=Drawing(size,size,transform=[size/(bounds[2]-bounds[0]),0,0,size/(bounds[3]-bounds[1]),0,0]);d.add(code)
add(Table([[d,para('扫码或点击网址访问。网站公开可用，无需安装本地依赖。<br/>版本日期：2026-10-10<br/>本手册包含架构说明、自绘图和19张真实UI操作截图。','small')]],colWidths=[88,CW-88],style=TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE')])) )
add(PageBreak(),para('阅读导航','chapter'),p('建议先用第1、2章熟悉界面，再按任务进入硬件、网络或安全主题。第13至15章解释NCCL动画；第23章提供19张真实界面截图与逐图操作说明。'))
toc=TableOfContents();toc.levelStyles=[ParagraphStyle('TOC0',fontName='GuideCN',fontSize=10.5,leading=16,textColor=INK,spaceBefore=0,leftIndent=0,firstLineIndent=0)];add(toc)

chapter('01 访问网站与五分钟上手',
 p(f'打开 <link href="{SITE}" color="#385e27">公开网站</link>。3D图形由访问者浏览器执行，网站没有连接真实GPU集群；界面里的粒子、数值和状态均按教学语义解释。'),
 tab(['步骤','操作','你应看到什么'],[
 ['1','左侧选择“整柜概览”','机架、托盘、电源层、背部结构及整柜数量。'],
 ['2','拖动、滚轮、右键；点击计算托盘','旋转/缩放/平移；进入计算托盘内部。'],
 ['3','搜索gpu-72或点击GPU','右侧显示型号、规格、连接和来源编号。'],
 ['4','点击“展开图文详解”','同主题的结构图、数据流步骤、原图和边界。'],
 ['5','进入“NCCL推理动画”并播放','3个OS域、6个GPU及逐步归约和token演示。'],
 ],[40,190,CW-230]),
 h('建议的第一条探索路线'),p('整柜概览 → 计算托盘 → NVLink交换网络 → 三级网络 → 安全信任链 → NCCL推理动画。硬件视图解释“在哪里、连到谁”，图文专题解释“为什么这样工作、哪些结论还不能确定”。'),
 h('访问前提'),p('建议使用支持WebGL的现代桌面浏览器。官方产品图片需要访问NVIDIA站点；图片加载失败时可以继续使用本地几何模型、规格面板和原始来源链接。'),
 small('无需Cloudflare账户即可浏览公开网站；Cloudflare登录仅用于维护者发布新版本。'))

chapter('02 界面、交互与阅读方式',Diagram('ui',220),
 tab(['区域','主要操作'],[['左侧导航与目录','7个视图；GPU、CPU、NIC、DPU目录；/快捷键聚焦搜索。'],['顶部与主视图区','来源库、PDF说明、拓扑JSON导出；本视图图文详解。'],['3D工具栏','切换官方图片、写实材质、标签、前后视角、展开结构与重置。'],['连接图层与过滤器','按NVLink、C2C、PCIe、Scale-Out、Astra、存储、OOB、电力和液冷筛选。'],['右侧模块详情','数量、功能、连接对象、逐项规格和来源；相关安全专题入口。']],[120,CW-120]),
 p('已整体放大导航、正文、规格与图例字号。页面内容较长时可以向下滚动；图文窗口有独立滚动条。按Esc或右上角×关闭图文窗口。'),
 small('在3D画布上滚轮默认缩放模型；阅读页面下方的步骤和表格时，将指针移到画布外再滚动。'))

chapter('03 整柜概览',Diagram('rack',230),
 tab(['部件','数量','解释'],[['Compute Tray','18','上部10个、下部8个；每托盘2CPU、4GPU。'],['NVLink Switch Tray','9','位于计算托盘之间，每托盘4颗ASIC，共36颗。'],['网络端点','144 CX9 / 18 DPU','每托盘8个ConnectX-9端点与1个BlueField-4。'],['后部互联','4 cartridge / 约5,000铜缆','spine为被动连接结构，不把每条示意线当成一条真实铜缆。'],['电源层','4 × 110kW','上下各2层；是额定容量和，不是机架实测功耗。']],[120,105,CW-225]),
 p('模型按官方DGX VR机柜图的分区组织，顶部还显示管理ToR。外形与比例用于结构解释，不可用于机房机械安装、走线或液冷工程设计。','HW01','HW07','HW08'),
 small('点击计算托盘进入内部；切换后视角检查spine、cartridge、busbar和manifold。'))

chapter('04 计算托盘与组件照片',Diagram('tray',235),
 p('一个计算托盘包含两个Superchip，每个Superchip由1颗Vera CPU和2颗Rubin GPU组成。DPU与两个四端点SuperNIC板组共同提供基础设施和外部网络能力。','HW01','HW06','HW90'),
 h('怎样操作'),p('用左右箭头遍历18个托盘；点击CPU、GPU、DPU或CX9查看详情。工具栏“写实材质”展示参考官方图构建的金属外壳、冷板、管路、内存插槽与前部把手；“官方产品图”切换到原图浏览。'),
 h('三条连接不能混淆'),
 tab(['连接','职责','关键口径'],[['NVLink-C2C','CPU与本地GPU一致性互联','1.8TB/s按Superchip聚合，不在两条分支上各算一遍。'],['NVLink 6','GPU进入机架交换fabric','逐GPU物理lane与端口映射待核实。'],['PCIe / Astra','通用设备I/O / DPU专用控制','Astra控制连接不等于所有GPU数据绕经DPU。']],[110,150,CW-260]),
 small('官方图片可能含首发规格；产品图与当前规格表不同的数值请以证据面板并列口径阅读。','HW03','SEC01'))

chapter('05 NVLink交换网络与Scale-Up',Diagram('nvlink',195),
 p('主视图提供“整柜交换拓扑”和“交换托盘细节”。前者把18个计算托盘和9个交换托盘平铺，以便追踪源/目标GPU；后者展示一个托盘内4颗ASIC及金属壳体、冷板与管路。','HW01','HW07'),
 tab(['控件','作用'],[['源GPU / 目标GPU','选择一次教学通信的两个端点；目标不能与源相同。'],['交换托盘 / ASIC','选择示意交换节点，查看编号与来源。不能据此推断真实物理绑定。'],['逐步路径','源端准备 → spine → 交换/计算 → 目标端点 → 完成与同步。'],['操作类型','P2P、SHARP AllReduce、MoE All-to-All。'],['全部拓扑','切换全柜汇聚连接和聚焦路径；虚线表示逻辑关系。']],[140,CW-140]),
 h('三个演示分别讲什么'),p('P2P演示许可显存上下文中的读写路径；SHARP使用教学数值1、2、3、4说明在网SUM得到10；MoE演示按专家目的地分发激活，再由框架组织返回与组合。专家选择由模型/软件决定，不由NVLink理解token语义。','HW07'),
 small('SHARP只适用于支持的操作、数据类型及部署。其与机密模式组合、交换端点密钥角色均不能由图形动画推定。','SEC11'))

chapter('06 三级网络与带外管理',Diagram('network',218),
 p('颜色按职责组织：红色为NVLink/C2C，蓝色为Scale-Out，绿色为Astra控制，青色为存储与基础设施，灰色为BMC带外管理。它们不是OSI层级，也不表示流量一定经过同一物理通道。','HW02','SEC03'),
 tab(['网络','主要对象','典型流量'],[['Scale-Up','CPU、GPU、NVLink交换fabric','一致性交互、collectives、peer memory。'],['Scale-Out','CX9与外部Spectrum-X/Quantum-X800','跨机架训练/推理的计算数据面。'],['Scale-In','BlueField-4、DOCA及访问fabric','数据、存储、安全、接入与基础设施运维。'],['带外管理','BMC、管理ToR、DPU管理入口','配置、监控、固件与恢复等管理职责。']],[85,200,CW-285]),
 p('网络视图中的对端机架、交换网络和存储为逻辑示意。可切换Spectrum-X与Quantum-X800，并用图层过滤器单独观察不同职责。','HW02','HW13'),
 small('BMC 1GbE有官方依据；BMC → HMC → DPU的管理关联不是已证实的串行密码证明链。','HW01','HW02'))

chapter('07 Scale-In基础设施专题',Diagram('network',195),
 p('从三级网络或专题标签进入Scale-In。其核心是让访问、存储、安全和运维跟上AI计算：BlueField提供主机之外的处理域，DOCA组织服务，Spectrum-X连接访问和存储路径。范围不只机柜内部。','SEC03'),
 tab(['层次','角色','使用时关注'],[['BlueField-4','策略、服务状态与内联加速','具体SKU、权限边界和接口配置。'],['DOCA服务','HBN、Flow、SNAP、Argus、DPF/DMS、Telemetry等','每种服务的实际启用与服务链。'],['访问fabric','连接应用、数据源和外部存储','拥塞、并发隔离、传输保护与终止点。']],[105,210,CW-315]),
 h('在图文中切换三条路径'),p('“访问与存储”说明南北向数据职责；“管理与安全策略”说明主机外的配置和运维；“Astra延伸到Scale-Out”说明DPU管理CX9策略而CX9仍承担计算数据面。'),
 p('同一DPU参与多个基础设施域，不意味着所有东西向张量都绕经它的800Gb/s外部接口。存储检查点的传输保护与落盘密钥也要分别配置。','SEC03','HW90'),
 small('服务、吞吐与恢复能力按完整软硬件BOM验收，不用峰值接口速率代替业务性能。'))

chapter('08 Astra控制权与信任边界',Diagram('astra',225),
 p('Astra全名Advanced Secure Trusted Resource Architecture。核心职责是把SuperNIC管理权放到BlueField-4基础设施域：管理侧经DPU带外入口下发配置，DPU通过专用连接管理CX9，策略在SuperNIC硬件执行。','SEC01','SEC02'),
 h('站内四个阅读页签'),
 tab(['页签','阅读重点'],[['理念与架构','切换控制面、租户数据面、南北向服务三条路径。'],['策略如何执行','从管理入口、DPU控制、专用连接到硬件执行与遥测。'],['信任链中的位置','区分基础设施控制、Realm执行保护和可信设备I/O。'],['边界与原始图','查看官方Astra图及尚未披露的密码实现。']],[135,CW-135]),
 p('Astra模式下SuperNIC按设计锁定并由DPU管理；租户有数据面的使用权，不掌握管理接口。专用链路的承载、密码套件、握手及轮换机制未完整披露。','SEC02','HW90'),
 small('Astra不是Realm，不代替GPU证明、IMEX授权或租户密钥释放；Sentry和Argus也各有独立职责。'))

chapter('09 机密计算保护哪些路径',Diagram('cc',220),
 p('进入机密计算后打开图文详解。首先区分三件事：平台公开支持什么、当前部署启用了什么、租户验证到了什么。机架级TEE不表示所有部件共用一把密钥。','SEC10','SEC11','SEC12'),
 tab(['路径','公开能力或设计要求','待核实边界'],[['CPU / Realm内存','Arm CCA/RME；每VM独立密钥','Vera具体密钥生成、迁移、轮换和销毁实现。'],['CPU ↔ GPU','authenticated C2C encryption','协议报文、密钥粒度及轮换细节。'],['GPU ↔ GPU','GPU间NVLink encryption','端到端/逐跳、交换ASIC持钥与加密下SHARP。'],['外部网络与存储','单独配置传输及静态保护','实际终止点、授权与端到端覆盖。']],[100,180,CW-280]),
 p('受保护端点在计算时仍需使用可处理的数据。分析安全边界时，要明确明文可能出现在哪个端点、由谁授权，以及数据离开机架后保护是否继续成立。','HW90'),
 small('本项目没有执行真实证明、DMA、设备配置或密钥释放。'))

chapter('10 SPDM、TDISP、IDE与证明流程',
 tab(['机制','解决什么问题','不能替代什么'],[['SPDM','设备身份认证、测量与安全会话','PCIe枚举不等于身份认证；SPDM不等于全部TLP已加密。'],['TDISP','把设备接口安全地分配给TEE，并管理接口状态','不能单独替代链路数据保护。'],['PCIe IDE','保护实际PCIe TLP的数据通路','不能自动保护设备内部缓冲区或外部网络。']],[85,210,CW-295]),
 p('设备接口授权与IDE通路都满足前提后才允许机密DMA。图文按依赖关系解释，不把“先开放DMA、再补加密”作为可执行部署时序。','SEC17','SEC18','SEC20'),
 h('从平台能力到租户可验证环境'),
 tab(['阶段','需要核验的内容'],[['1. 硬件与固件基线','设备身份、受信版本、根信任与测量来源。'],['2. CPU与guest','平台/Realm/guest证据和预期工作负载状态。'],['3. GPU与成员组','GPU身份、固件、安全能力、分配及组成员授权。'],['4. 安全I/O','SPDM、接口分配、IDE与DMA权限范围。'],['5. 业务密钥释放','结合证据、租户身份、授权和成员策略决定准入。'],['6. 撤销与恢复','设备重置、更新、移除、作业结束和证明失效。']],[135,CW-135]),
 small('这是工程验收框架，不声称NVL72默认部署了某种KMS、验证者或跨CVM通信组。','SEC10','SEC11','SEC18'))

chapter('11 BlueField-4中的Sentry',Diagram('sentry',210),
 p('Sentry是Open Agent Safety Platform中的带外watchdog参考设计，基于DOCA与BlueField-4，在agent执行域之外持续观察和执行。它不是用于GPU集群故障治理的NVSentinel。','SEC06','SEC07','SEC21'),
 h('图文专题的使用方式'),p('在“参考架构”中切换模型访问路径和观察执行闭环；在“观察与执行”中逐步查看身份、活动关联、判定、干预与恢复；在“隔离与验收”中阅读不可绕过性、可见性与延迟条件。'),
 tab(['验收问题','具体要问什么'],[['必要路径','所有模型访问是否经过预期执行点，是否有旁路凭证或出口？'],['可见性','看到元数据、工具/策略上下文还是获授权的明文？'],['响应时间','起点、终点、负载、P95/P99、超时及失败策略是什么？'],['恢复','误报如何处理，隔离规则怎样确认和撤销，谁有恢复权限？']],[100,CW-100]),
 small('指定参考拓扑中的“必要模型路径”不能外推为所有NVLink流量可见，也不能推断Sentry可读取Realm私有内存。','SEC07','SEC19'))

chapter('12 Open Agent Safety Platform',Diagram('platform',215),
 p('官方把平台分为应用、运行时和基础设施三层。OpenShell组织软件沙箱与策略；支持环境中的Sentry增加独立硬件观察和执行。OpenShell本身不要求BlueField-4。','SEC07','SEC08'),
 tab(['OpenShell组件','职责'],[['Gateway','身份、生命周期和策略管理。'],['Supervisor','在工作负载之外检查出站访问并执行相关策略。'],['Sandbox','内核层的文件、进程、网络隔离与执行约束。']],[120,CW-120]),
 p('可验证策略、带外执行、模型路径控制、权限与可观察性匹配、共同责任，是参考体系的设计原则。站内图文把这些原则转成可检查的问题，没有运行策略证明器或认证某个实际agent。','SEC07','SEC09'),
 small('模型提供方、企业与基础设施方的责任不能相互替代；硬件隔离不等于自动理解全部业务语义。'))

chapter('13 NCCL动画的域、rank和GPU',Diagram('ranks',200),
 p('该视图用3个OS域、6个GPU演示张量并行。选择“多个OS域”或“多个Realm VM · 概念示例”，然后播放、暂停、单步或调节速度。各阶段也可直接点击。'),
 tab(['教学域','示例rank / GPU','权重分片'],[['OS A / Realm A','rank0 GPU01；rank1 GPU02','W0 / W1'],['OS B / Realm B','rank2 GPU03；rank3 GPU04','W2 / W3'],['OS C / Realm C','rank4 GPU05；rank5 GPU06','W4 / W5']],[140,230,CW-370]),
 p('rank是通信组成员编号，与物理GPU编号是两个概念；创建communicator时需要建立明确且唯一的设备映射，并经主机通信机制共享unique ID。','NC02'),
 h('职责分工'),p('推理框架负责模型分片、输入、调度、CUDA计算和采样；NCCL负责需要的collective通信；IMEX协调跨OS显存映射元数据，不转发张量。Realm证明、设备授权和密钥释放属于独立安全机制。','NC01','NC02','SEC13'),
 small('3域/6GPU只是教学子集，不宣称NVL72的默认OS/VM/GPU分配方式。'))

chapter('14 看懂Reduce-Scatter与AllGather',Diagram('ring',190),
 p('演示选择6-rank逻辑Ring。每个rank的教学输入是6个标量分块；第r个rank、第c个分块的值为(r+1)×(c+1)。模型在每轮同步地发送一个分块给下一rank。'),
 tab(['阶段','轮数','结果'],[['Reduce-Scatter','5轮','每个rank最终拥有一个已完成求和的分块。'],['AllGather','5轮','传播已归约分块，使全部rank得到完整向量。'],['最终AllReduce','每rank相同','[21, 42, 63, 84, 105, 126]']],[125,60,CW-185]),
 p('NCCL文档确认ReduceScatter接AllGather等价于AllReduce。本项目的Ring是可复现的教学算法，实际NCCL可能根据拓扑、消息大小、版本和配置选择不同算法。','NC01','SEC16'),
 h('操作与观察'),p('点击第5阶段查看Reduce-Scatter，再逐步推进5轮；第6阶段查看AllGather。页面下方的矩阵表显示每个rank的当前分块值，最终结果一致。动画随后继续后续层与token阶段。'),
 small('4个教学token“机架级、互联、支撑、推理”为预设文本，不是真实大模型生成。没有推断真实时延、吞吐或带宽利用率。'))

chapter('15 多Realm推理的适用性边界',
 p('机架级机密计算的公开能力，与某一套跨OS、跨Realm、NCCL、IMEX和GPU分配组合的正式产品支持，是不同层次的证据。动画的Realm模式表示目标架构与需满足的条件。','SEC10','SEC11','HW90'),
 tab(['需要成立的条件','为什么要分别确认'],[['CPU/Realm/guest证明','工作负载身份和CPU侧隔离状态需要可验证。'],['GPU身份与可信设备分配','需要确认GPU、固件、接口、上下文及DMA权限。'],['跨域通信组与映射授权','共享对象、IMEX domain/channel和通信组成员策略必须一致。'],['受保护会话','跨C2C、NVLink与PCIe的保护与密钥生命周期需满足要求。'],['版本组合','驱动、CUDA、NCCL、IMEX、RMM/guest和DPU软件BOM需兼容。'],['撤销和故障恢复','退出、重置、失效成员、证明变化与密钥撤销不能遗漏。']],[160,CW-160]),
 h('正确的演示结论'),p('可以从动画理解分布式推理中的角色、逻辑数据流和collective数值机制；不能据此断言多个Realm已经能够在指定Vera Rubin配置上开箱即用地共享NVLink显存。'),
 p('NCCL MNNVL要求受支持系统、cuMem和有效IMEX domain；IMEX在Vera Rubin上的具体产品绑定仍需核实。','SEC13','SEC16'),
 small('普通多OS通信的实现证据，不应被直接转写为跨CVM机密通信的正式支持声明。'))

chapter('16 官方图片、来源与公开冲突',
 p('网站共登记22张官方图片外链，覆盖机柜前后、托盘、芯片、DPU/NIC、Astra、Scale-In、机密计算和Agent Safety。主视图右上参考卡、详情产品图与“官方产品图”按钮均可进入大图模式。'),
 tab(['证据状态','如何阅读'],[['已确认','引用的公开资料支持该项声明；不等于实机验证或默认使能。'],['冲突','不同官方资料的公开口径不同，界面并列保留。'],['待核实','当前材料不足，或具体软件/SKU/配置支持尚不清楚。']],[110,CW-110]),
 tab(['项目','本项目处理'],[['晶体管','336 billion = 3360亿，纠正十倍换算错误。'],['CX9端点','当前DGX VR为800Gb/s/端点；1.6Tb/s是每GPU口径。'],['NVLink','单GPU3.0/3.6TB/s；整柜216/约260TB/s并列。'],['HBM','单GPU19.2/22TB/s并列；当前整柜约1400TB/s。1580历史快照未复现。'],['TLS卸载','DOCA3.5.0明确本机架所用CX9不支持TLS硬件卸载。']],[105,CW-105]),
 small('这些纠错对应HW03/04/05/06/07/10。图片中的首发数字不覆盖详情面板的来源与版本限定。', 'HW03','HW04','HW05','HW06','HW07','HW10'))

chapter('17 本地运行、Cloudflare更新与分享',
 p('公开站点托管于Cloudflare Workers，项目名vera-rubin-nvl72。访客不需要登录；维护者更新时需使用自己的Cloudflare授权。站点只发布dist中的静态运行文件。'),
 tab(['任务','命令或入口'],[['本地运行','npm install<br/>npm run dev'],['验证','npm test<br/>npm run build'],['发布前检查','npm run deploy:check'],['更新线上版本','npm run deploy'],['新电脑首次授权','npx wrangler login --device'],['发布配置','wrangler.jsonc：assets.directory为./dist，SPA导航回退为index.html。']],[145,CW-145]),
 h('推荐的更新顺序'),p('修改源码或来源数据 → 必要时运行npm run data:generate → npm test → npm run deploy → 检查首页与JS/CSS/PDF资源。不要用旧的本地ZIP覆盖更新后的构建。'),
 h('如何分享'),p(f'工作群分享公开网址即可：<link href="{SITE}" color="#385e27">{SITE}</link>。本PDF可由网站顶部“使用说明PDF”下载。原始官方图片依赖NVIDIA站点可达性，浏览网站无需访问维护者电脑。'),
 small('Wrangler设备码过期时重新执行登录；此方式不依赖浏览器回跳localhost:8976。'))

chapter('18 常见问题与验收范围',
 tab(['现象','处理方式'],[['模型没有显示','使用支持WebGL的浏览器；关闭过多高负载页面；仍可查看目录与图文资料。'],['画面卡顿','暂停粒子，关闭标签，开启过滤器里的节能模式，缩小窗口或减少同时显示的路径。'],['图片长时间加载','官方图为外链；可切回3D几何模型，或点击原始图片/来源页核对网络。'],['看不清数据或说明','页面已放大字号；向下滚动查看步骤/矩阵，图文窗口内部也可滚动。'],['NVLink路径像环或总线','图形是逻辑演示，真实端口连接未核实；NCCL的逻辑Ring不等于物理接线。'],['浏览器打不开localhost回调','发布登录使用wrangler login --device重新获取设备码；访客无需此操作。']],[130,CW-130]),
 h('本次验证'),p('项目通过TypeScript和生产构建；16项自动测试覆盖拓扑、来源、数量、机柜分区及Ring归约正确性。Safari中检查了3D视图、官方图片、图文专题和NCCL单步归约结果。'),
 h('尚未进行的实测'),p('没有连接真实NVL72设备，没有执行真实NCCL、Realm证明、SPDM、DMA或策略隔离。没有跨手机/浏览器性能矩阵、实测FPS、时延、功耗和机柜液冷数据。因此本项目适合架构学习与方案交流，不替代厂商部署、工程安装或安全认证资料。'),
 small('更细的项目验证与待核实清单位于源码中的VERIFICATION.md。'))

chapter('19 Top-of-Rack Ethernet Switches',Diagram('network',205),
 p('DGX VR官方配置包含2台管理ToR，连接计算托盘BMC、BlueField-4 BMC以及交换托盘的管理资源。当前引用的DGX硬件章节未明确给出ToR SKU，本项目不从其他OEM或旧平台借用型号。','HW01','HW02'),
 tab(['概念','角色','不要混淆'],[['管理ToR','机架顶部的Ethernet管理接入','不是GPU的NVLink数据面交换ASIC。'],['NVLink Switch Tray','机架内部GPU Scale-Up fabric','不是BMC 1GbE的管理交换机。'],['Spectrum-X / Quantum-X800','外部计算机架间的网络平台','不等于机架顶部两台管理ToR。']],[145,170,CW-315]),
 h('管理网络能说明什么'),p('BMC管理网络用于状态、固件、电源、配置与恢复等职责；网络可达、设备身份、固件测量和管理授权仍需分别核验。BMC与HMC共同提供管理，不构成已证明的串行密码链。','HW01'),
 small('双ToR的冗余布线、LAG/VLAN、ACL和凭证策略需按实际交付确认，不能仅从“两台”推导出完整高可用方案。'))

chapter('20 NVLink-C2C一致性与保护',Diagram('tray',210),
 p('NVLink-C2C连接Vera与本地Rubin，支持CPU主机执行与GPU加速的协作。一个Superchip包含1 CPU与2 GPU，公开1.8TB/s是这个组合的聚合双向口径。','HW03','HW06'),
 tab(['问题','解释'],[['为什么需要C2C','提供CPU/GPU间一致性事务与数据交互，配合主机执行、内存管理和GPU任务。'],['是否把两个GPU带宽相加','不能将1.8TB/s在两条分支上各独占计数；分支分配细节需核验。'],['是否经过NVLink交换托盘','本地CPU/GPU的C2C，与GPU间的机架级NVLink 6 fabric是不同连接职责。'],['安全能力','官方明确authenticated C2C encryption，但未完整披露具体密码算法和密钥协议。'],['是否等于全柜共享OS','一致性互联不自动合并独立主机、进程、授权和虚拟机边界。']],[135,CW-135]),
 small('C2C、PCIe IDE、SPDM安全会话与GPU NVLink数据面分别分析，不把它们的密钥直接视为同一把。','SEC10','SEC11','SEC17','SEC18'))

chapter('21 六芯片平台博客导读',
 p('站内“平台全景”按NVIDIA六芯片博客的主题组织原创图解，并与硬件指南、GPU/CPU及软件文档交叉核验。它不是博客全文翻译，也不将所有峰值拼成一个出货规格。','HW06'),
 tab(['芯片','关键职责','重点口径'],[['Vera CPU','主机执行、内存与设备编排','88 Olympus核、空间多线程；每CPU最高1.5TB LPDDR5X。'],['Rubin GPU','Tensor Core、HBM4、GPU TEE','3360亿晶体管；第三代Transformer Engine。'],['NVLink 6 Switch','机架级Scale-Up交换与SHARP','9托盘×4ASIC；全互联是逻辑可达。'],['ConnectX-9','跨机架计算网络端点','DGX每端点800Gb/s，博客1.6Tb/s为每GPU。'],['BlueField-4','独立基础设施处理与Astra','DOCA服务与硬件策略执行，不是Rubin GPU。'],['Spectrum-6','外部Ethernet fabric','官方博客102.4Tb/s/交换芯片；Tb/s不等于TB/s。']],[110,160,CW-270]),
 p('软件层分别组织计算、通信和模型服务：CUDA/库承载计算，NCCL承担collectives，TensorRT-LLM等引擎优化推理，Dynamo组织分布式服务，DOCA负责基础设施。','HW06','NC01','SW01','SW02'),
 p('MoE根据专家目的地分发激活并组合结果；reasoning按模型并行策略反复计算和同步，不是所有推理都使用All-to-All。能效、RAS、维护和机密计算条件也需单独评估。','HW05','HW06','HW07'),
 small('计算托盘维护需按手册离线；交换托盘热插拔能力不意味着任意部件可以随时带电拆卸。'))

chapter('22 NVLink 6链路加密与认证边界',Diagram('crypto',190),
 p('官方明确authenticated C2C encryption以及GPU间NVLink encryption。平台级端到端保护措辞，不足以单独确认NVLink 6交换ASIC的持钥、解密、逐跳或纯密文转发角色。','SEC10','SEC11'),
 h('通用原理与平台实现分别阅读'),p('AEAD可以用密钥、nonce、明文和AAD生成密文与认证标签。接收端验证后才交付数据；AAD参与认证但不必保密。完整旧包可能仍具有有效标签，消息新鲜度需要协议状态检查。','CR01','CR02'),
 tab(['站内交互','预期结果'],[['生成并接收新包','通用AES-GCM正常认证与解密。'],['篡改密文 / AAD','认证失败，不向应用交付明文。'],['重放旧包且序号检查开启','标签有效，但因序号已使用而拒绝。'],['关闭序号检查后重放','旧包仍可通过认证，说明AEAD不自动等于防重放。']],[195,CW-195]),
 small('浏览器示例采用256位AES-GCM密钥、96位IV和128位标签，仅用于教学，不是NVLink 6已披露规格。NVLink的数据算法、标签格式、密钥生命周期、重放窗口及加密下SHARP仍待核实。','CR01','SEC11'))

chapter('23 真实界面操作图册',p('以下19张图均从本项目实际运行的Safari界面截取，非设计稿、AI图片或合成效果。按操作任务裁切无关边框，未修改界面数值。截图使用与上线版本相同的前端代码；本地地址不是访客访问地址。'),small('截图拍摄日期：2026-10-10。部分截图显示NVIDIA官方图片的缩略呈现，© NVIDIA Corporation；相应原图来源见图下注记与第24章。这里不提供官方原图文件。'))
shots=[
 ('01-rack','01 整柜与整体阅读顺序',(0,89,1985,1180),'左侧选择“整柜概览”；中央显示整柜，右侧是当前模块详情。点击托盘进入内部；在画布外滚动可以看下方图例。','先读18个计算托盘、9个交换托盘和72GPU数量，再沿模型进入组件。右侧每项规格都附来源；全柜聚合带宽冲突保留并列口径。',['HW01']),
 ('02-compute-tray','02 计算托盘：芯片、接口与管路',(274,217,1119,965),'选择“计算托盘”，用工具栏左右箭头遍历18个托盘；点击芯片可在右侧查看编号、规格和连接对象。','两组Superchip各含1CPU和2GPU；前部为两个四端点SuperNIC板组，BlueField-4承担Astra管理。绿色连线是控制关联，不能推断真实PCIe布线。',['HW01','HW06']),
 ('03-fabric','03 NVLink：选择端点与交换节点',(274,126,1119,851),'进入“NVLink交换网络”，在上方选择源GPU、目标GPU、示意交换托盘和ASIC；点击“显示72GPU全拓扑”可切换汇聚关系。','两侧是按逻辑平铺的18个计算托盘，中央9个交换托盘包含36颗ASIC。GPU01到GPU38的路径是可选择的教学路径，不是已核实的逐端口走线。',['HW01','HW07']),
 ('04-fabric-step','04 Scale-Up：SHARP教学步骤',(274,572,1119,1046),'在画布下方选择“SHARP AllReduce”，再点步骤卡或“下一步”。截图位于第1步，四个GPU部分值为1、2、3、4。','推进到交换/在网计算阶段，会展示SUM归约得到10；MoE按钮切换到按专家目的地分发的教学流程。动画不代表真实吞吐，也不确认加密条件下的SHARP实现。',['HW07']),
 ('05-switch-tray','05 交换托盘细节',(274,90,1119,852),'点击“交换托盘细节”，用上方托盘编号和ASIC下拉框选择观察对象；右侧详情同步切换到托盘或芯片。','截图展示四颗交换ASIC、冷板、管路、金属壳体和系统管理区域。BMC/ERoT用于管理与信任的事实，不能证明交换ASIC是否持有NVLink数据密钥。',['HW01','HW06']),
 ('06-networks','06 三级网络与对端机架',(274,173,1119,963),'选择“三级网络”，在画布左上切换Spectrum-X或Quantum-X800。底部连接图层可隐藏或显示相应网络。','蓝色连接计算网络，绿色关联Astra控制，青色通向存储/服务，灰色表示带外管理。对端机架与存储摆放用于解释职责，不是实际端口容量规划。',['HW02','HW06','HW13']),
 ('07-confidential','07 机密计算：保护域和不同机制',(274,173,1118,964),'选择“机密计算”，点击Realm、GPU TEE、IMEX、DPU或Sentry，比较它们在右侧显示的功能与边界；“展开图文详解”提供分路径说明。','紫色执行域、GPU TEE和受保护互联共同解释机架级能力；Astra控制权、IMEX映射授权和Sentry治理有各自职责，不是共用一把机架密钥。',['SEC10','SEC11']),
 ('08-trust','08 安全信任链：依赖关系',(274,173,1119,964),'选择“安全信任链”，点击根信任、固件、DPU/Astra、Realm和GPU等模块，逐个阅读要求和来源；再打开Astra专题。','箭头表示信任依赖，不是已确认的串行握手时序。CPU、GPU、固件、接口与组成员策略需要分别验证，管理可达不等于密码证明成立。',['SEC10','SEC11','SEC18']),
 ('09-astra','09 Astra：数据面与控制权',(153,83,1332,1030),'打开Astra的“理念与架构”，切换“Astra控制面”“租户计算数据面”“南北向服务”三个按钮；窗口内部可以独立滚动。','绿色路径从管理侧经DPU到8个CX9策略执行点；租户使用数据面。专用连接的密码协议、握手和轮换没有完整公开，不能从这张图补造。',['SEC01','SEC02']),
 ('10-aead-replay','10 认证加密：重放测试结果',(153,120,1332,1030),'进入“NVLink加密 → 交互验证”。依次生成新包、篡改密文、篡改AAD、重放；截图为序号去重开启后的重放拒绝。','这是实际运行的浏览器AES-GCM教学示例：标签有效的旧包仍需新鲜度检查。关闭序号去重后再次重放会被接受。AES位数、IV和标签长度均不是NVLink6已披露参数。',['CR01','CR02','SEC11']),
 ('11-platform','11 六芯片平台：按职责阅读',(153,120,1332,1030),'打开“平台全景 → 六种芯片”。卡片按芯片展示职责、规格、来源与边界；继续滚动可查看完整六种芯片。','不要把六种芯片当成六块GPU，也不要把博客首发指标、产品页现行口径和不同软件版本拼成一份保证出货的规格。',['HW06']),
 ('12-tor','12 管理ToR：连接谁、不承载什么',(153,120,1332,1030),'打开“管理ToR → 角色与拓扑”，沿图中管理侧到ToR、计算托盘BMC、DPU BMC和交换托盘管理资源的路径阅读。','图示职责分工，不确认双归属、LAG、VLAN或具体布线；管理ToR不承载GPU的NVLink张量交换。当前硬件章节未给出ToR SKU，站内保留待核实。',['HW01','HW02']),
 ('13-c2c','13 NVLink-C2C：逐步数据流',(153,120,1332,1030),'打开“NVLink-C2C → 数据如何流动”；点左侧五个步骤或右侧“下一步”，依次查看主机执行、边界交换、保护与机架域。','C2C连接同一Superchip中的Vera与Rubin；1.8TB/s为Superchip聚合口径。GPU进入机架级NVLink域是另一个连接职责。',['HW03','HW06','SEC10']),
 ('14-scale-in','14 Scale-In：访问、存储与管理',(153,120,1332,1030),'打开“Scale-In → 基础设施架构”；点击“访问与存储”“管理与安全策略”“Astra延伸到Scale-Out”观察高亮路径。','BlueField/DOCA处于独立基础设施处理域。不同流量按各自路径运行，不要求所有GPU数据经同一个DPU外部端口；服务启用和部署参数须独立核验。',['SEC03']),
 ('15-sentry','15 Sentry：独立观察与执行闭环',(153,120,1332,1030),'打开“Sentry → 独立参考架构”，选择观察与执行闭环；继续读“隔离与验收”中的不可绕过性、可见性和延迟条件。','DOCA/Sentry在BlueField-4独立域中关联身份、策略和活动证据。必要模型路径是指定参考拓扑的设计条件，不表示看见所有NVLink流量或Realm私有内存。',['SEC06','SEC07']),
 ('16-agent-safety','16 Open Agent Safety三层体系',(153,120,1332,1030),'进入“Open Agent Safety → 三层参考体系”，再查看OpenShell组件与Sentry硬件执行两个页签。','应用层、运行时层、基础设施层分工明确；OpenShell无需BlueField-4。Sentry是支持环境中的可选硬件治理层，不能替代软件策略和租户执行保护。',['SEC07','SEC08']),
 ('17-nccl-realms','17 多OS与Realm概念动画',(274,114,1119,914),'选择“NCCL推理动画”，切换多个OS或“多个Realm VM · 概念示例”；用播放、单步、速度和复位控制流程。','画布展示3个域、6个示例rank/GPU。Realm模式明确标注支持组合待核实；这里理解的是通信职责和安全前提，没有运行真实大模型或NCCL进程。',['NC02','SEC16']),
 ('18-nccl-matrix','18 AllGather：核对每个rank结果',(274,90,1119,965),'进入第6阶段“AllGather”，连续单步至第5轮；将指针移出3D画布并向下滚动，查看每个rank的分块矩阵。','全部rank得到[21,42,63,84,105,126]。这是6-rank教学输入的可复现求和结果；Reduce-Scatter加AllGather等价于AllReduce，实际NCCL可选其他算法。',['NC01']),
 ('19-evidence','19 来源库：区分确认、冲突和未知',(143,135,1342,1014),'点击顶部“来源与核验”，可搜索模块/规格/协议，按可信度筛选；切换“来源清单”和“官方原图”追踪资料。','每条规格对应来源编号。截图并列展示216/约260TB/s冲突与1580TB/s待核实历史口径；“已确认”仍表示公开证据支持，不等于完成实机验收。',['HW03','HW04','HW07']),
]
for index,(name,title,crop,operation,meaning,ids) in enumerate(shots):
 if index:add(PageBreak())
 add(h(title),Screenshot(name,crop,365 if index==0 else 465),p('<b>照图操作：</b>'+operation),p('<b>结果解读：</b>'+meaning),small('图源：本项目真实界面截屏；图内官方图片缩略图版权归NVIDIA。相关事实和原图出处：',*ids))

chapter('24 来源索引与版权说明',p('正文编号对应下面的原始资料。官方网页标题和URL可点击；本地文件以文档名与章节/已核实页码定位。访问与核验日期为2026-10-10。'),p('网站官方原图通过外链展示，项目不提供可独立使用的官方原图副本。按用户要求，PDF新增实际UI截图，截图中出现的少量官方图片缩略图版权归NVIDIA，仅为说明本网站操作；独立使用或再分发原图须另行核对许可。自绘结构图不冒充NVIDIA工程图、CAD或认证结果。'))

for source in sources:
 id=source['id'];title=html.escape(source['title']);section=html.escape(source.get('section',''))
 text=f'<b>[{id}] {title}</b><br/>{section}'
 if source.get('url'):
  url=html.escape(source['url'],quote=True);text+=f'<br/><link href="{url}" color="#385e27">{url}</link>'
 add(KeepTogether([para(text,'source')]))


OUT.parent.mkdir(parents=True,exist_ok=True)
doc=GuideDoc(OUT);doc.multiBuild(story)
shutil.copyfile(OUT,ROOT/'public/guides/nvl72-user-guide.pdf')
print(json.dumps({'output':str(OUT),'bytes':OUT.stat().st_size},ensure_ascii=False))
