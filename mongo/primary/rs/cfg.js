var cfg = rs.conf();

for(var i = 1; i < cfg.members.length; i++) {
  cfg.members[i].priority = 1;
  cfg.members[i].votes = 1;
}

rs.reconfig(cfg);
