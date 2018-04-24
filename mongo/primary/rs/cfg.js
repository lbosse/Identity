var cfg = rs.conf();

cfg.members[0].tags = {'rs0': 'rs0'};
for(var i = 1; i < cfg.members.length; i++) {
  cfg.members[i].tags = {'rs0': 'rs0'};
  cfg.members[i].priority = 1;
  cfg.members[i].votes = 1;
}

rs.reconfig(cfg);
